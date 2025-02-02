import { type Actions, fail } from "@sveltejs/kit";
import { Upload } from "@aws-sdk/lib-storage";
import { ASSET_STORAGE_PREFIX, internalS3Client } from "$lib/server/utilities/s3";
import { db } from "$lib/server/db/db";
import { assets } from "$lib/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

function getFilenameFromHeader(headers: Headers): string {
  const contentDisposition = headers.get('content-disposition');
  if (!contentDisposition) return 'unknown';
  
  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
  return filenameMatch ? filenameMatch[1] : 'unknown';
}

function getContentTypeFromHeader(headers: Headers): string {
  const contentType = headers.get('content-disposition');
  if (!contentType) return 'application/octet-stream';
  
  const contentTypeMatch = contentType.match(/content-type="?([^"]+)"?/);
  return contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream';
}

function getAssetType(assetType: string): 'IMAGE' | 'VIDEO' {
  if (assetType.includes('image/')) {
    return 'IMAGE';
  } else if (assetType.includes('video/')) {
    return 'VIDEO';
  } else {
    throw new Error('Invalid asset type');
  }
}

export const actions = {
  upload: async ({ request, locals }) => {
    try {
      const user = locals.user
      if (user === null) throw fail(401);

      const contentType = request.headers.get('content-type');
      if (!contentType?.includes('multipart/form-data')) {
        return fail(400, { error: true, message: "Invalid content type" });
      }

      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        return fail(400, { error: true, message: "No boundary found" });
      }

      const assetId = uuidv4()
      const assetStoragePrefix = `${ASSET_STORAGE_PREFIX}/${assetId}`
      const uploadFilename = getFilenameFromHeader(request.headers)
      const uploadContentType = getContentTypeFromHeader(request.headers)
      const assetType = getAssetType(uploadContentType) 

      const [asset] = await db.insert(assets).values({
        id: assetId,
        ownerId: user.id,
        type: assetType,
        status: "UPLOADING",
        title: uploadFilename,
        filename: uploadFilename,
        mimeType: uploadContentType,
        storagePrefix: assetStoragePrefix,
        storageKey: `${assetStoragePrefix}/${assetId}`,
        storageBucket: process.env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET!,
      }).returning()

      const parallelUpload = new Upload({
        client: internalS3Client,
        queueSize: 4,
        partSize: 25 * 1024 * 1024,
        leavePartsOnError: false,
        params: {
          Bucket: process.env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET!,
          Key: asset.storageKey,
          Body: request.body ?? undefined,
          ContentType: getContentTypeFromHeader(request.headers)
        }
      });

      await parallelUpload.done();

      await db.update(assets).set({
        status: "UPLOADED"
      }).where(eq(assets.id, assetId))

      // TODO :: Kick off processing jobs
      // metadata job
      // thumbnail job
      // processing job

      return { success: true };

    } catch (error) {
      console.error("Upload error:", error);
      return fail(500, { error: true, message: "Upload failed" });
    }
  }
} satisfies Actions;