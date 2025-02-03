import { type Actions, fail } from "@sveltejs/kit";
import { ASSET_STORAGE_PREFIX, s3Client } from "$lib/server/utilities/s3";
import { db } from "$lib/server/db/db";
import { assets } from "$lib/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { assetProcessingQueue, AssetTasks } from "$lib/server/tasks/queues";
import { CompleteMultipartUploadCommand, CreateMultipartUploadCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { env } from "$lib/server/utilities/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";

function getAssetType(mimeType: string): "IMAGE" | "VIDEO" {
  if (mimeType.startsWith("image/")) {
    return "IMAGE";
  } else if (mimeType.startsWith("video/")) {
    return "VIDEO";
  } else {
    throw new Error("Invalid asset type");
  }
}

export const load: PageServerLoad = async ({ locals }) => {
  const fetchedAssets = await db.select().from(assets).where(eq(assets.ownerId, locals.user.id));
  return {
    assets: fetchedAssets
  };
};

export const actions = {
  createUpload: async ({ request, locals }) => {
    const user = locals.user;
    if (user === null) throw fail(401);
    
	  const data = await request.formData();
		const filename = data.get('filename')?.toString();
		const totalParts = data.get('totalParts')?.toString();
    const type = data.get('type')?.toString();

    if (!totalParts || !type || !filename) {
      return fail(400, { error: true, message: "Missing required fields" });
    }
    
    const assetId = uuidv4();
    const storageKey = `${ASSET_STORAGE_PREFIX}/${assetId}/${assetId}`;
    console.info("createUpload", filename, totalParts, new Date().toISOString());

    const createCommand = new CreateMultipartUploadCommand({
      Key: storageKey,
      ContentType: type,
      Bucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
    });

    const { UploadId } = await s3Client.send(createCommand);

		const signedUrls = await Promise.all(
			Array.from({ length: parseInt(totalParts) }, (_, i) => i + 1).map(async (partNumber) => {
				const command = new UploadPartCommand({
					UploadId,
					Key: storageKey,
					PartNumber: partNumber,
					Bucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
				});

				const signedUrl = await getSignedUrl(s3Client, command, {
					expiresIn: 3600 * 24, // 24 hours
				});

				return {
					signedUrl,
					partNumber,
				};
			}),
		);

    return { 
      assetId,
      storageKey,
      uploadId: UploadId,
      uploadUrls: signedUrls,
     };
  },
  completeUpload: async ({ request, locals }) => {
    const user = locals.user;
    if (user === null) throw fail(401);
    console.info("completeUpload", new Date().toISOString());

	  const data = await request.formData();
		const key = data.get('key')?.toString();
		const uploadId = data.get('uploadId')?.toString();
    const parts = data.get('parts')?.toString();
    const assetId = data.get('assetId')?.toString();
    const type = data.get('type')?.toString();
    const filename = data.get('filename')?.toString();

    const command = new CompleteMultipartUploadCommand({
      Bucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map(({ ETag, PartNumber }) => ({
          ETag,
          PartNumber,
        })),
      },
    });

    const result = await s3Client.send(command);
    const assetStoragePrefix = `${ASSET_STORAGE_PREFIX}/${assetId}`;

    const [asset] = await db
      .insert(assets)
      .values({
        id: assetId,
        ownerId: user.id,
        type: getAssetType(type),
        status: "UPLOADED",
        title: path.parse(filename).name,
        filename: filename,
        mimeType: type,
        storagePrefix: assetStoragePrefix,
        storageKey: `${assetStoragePrefix}/${assetId}`,
        storageBucket: process.env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET!
      })
      .returning();

    await assetProcessingQueue.add(AssetTasks.INGEST_ASSET, {
      assetId
    });

    return { success: true };
  },
} satisfies Actions;