import { Hono } from "hono";
import path from 'path';
import { v4 as uuid } from "uuid";
import { userAuth, UserAuthMiddleware } from "../middleware/auth";
import {
  UploadPartCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3InternalClient, s3PublicClient } from "../lib/s3";
import { env } from "../lib/env";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/db";
import { assets } from "../db/schema";


const router = new Hono<{ Variables: UserAuthMiddleware }>();
router.use(userAuth);

router.post('/', zValidator('json', z.object({
  filename: z.string(),
  contentType: z.string(),
  parts: z.number()
})), async (c) => {
  // const { user } = c.get("authorization");
  const { filename, contentType, parts } = c.req.valid('json');

  const uploadId = uuid()
  const key = `${env.ALCOVES_OBJECT_STORE_UPLOAD_PREFIX}/${uploadId}`;

  const createCommand = new CreateMultipartUploadCommand({
    Key: key,
    ContentType: contentType,
    Bucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
  });

  const { UploadId } = await s3InternalClient.send(createCommand);

  const signedUrls = await Promise.all(
    Array.from({ length: parts }, (_, i) => i + 1).map(async (partNumber) => {
      const command = new UploadPartCommand({
        Bucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
        Key: key,
        UploadId,
        PartNumber: partNumber
      });

      const signedUrl = await getSignedUrl(s3PublicClient, command, {
        expiresIn: 3600 * 24 // 24 hours
      });

      return {
        signedUrl,
        partNumber
      };
    })
  );

  return c.json({
    payload: {
      uploadId: UploadId,
      key,
      parts: signedUrls
    }
  });
})

router.post('/complete', zValidator('json', z.object({
  name: z.string(),
  size: z.number(),
  mimeType: z.string(),
  key: z.string(),
  uploadId: z.string(),
  parts: z.array(z.object({
    ETag: z.string(),
    PartNumber: z.number()
  }))
})), async (c) => {
  const { key, uploadId, parts, name, size, mimeType } = c.req.valid('json')

  try {
    const command = new CompleteMultipartUploadCommand({
      Bucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map(({ ETag, PartNumber }) => ({
          ETag,
          PartNumber
        }))
      }
    });

    const result = await s3InternalClient.send(command);
    const assetTitle = path.parse(name).name || 'New Upload';

    const [asset] = await db.insert(assets).values({
      ownerId: c.get('authorization').user.id,
      title: assetTitle,
      description: "",
      metadata: {},
      size: size || 0,
      storageKey: key,
      storageBucket: env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET,
      mimeType: mimeType || "application/octet-stream",
    }).returning()

    return c.json({
      payload: {
        asset,
        location: result.Location,
        key: result.Key,
        bucket: result.Bucket
      }
    });
  } catch (error) {
    console.error('Complete multipart upload failed:', error);
    return c.json({ 
      error: "Failed to complete multipart upload" 
    }, 500);
  }
});

export const uploadsRouter = router;
