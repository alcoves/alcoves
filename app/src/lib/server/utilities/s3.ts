import { S3Client } from "@aws-sdk/client-s3";

export const ASSET_STORAGE_PREFIX = "assets";

export const internalS3Client = new S3Client({
  region: process.env.ALCOVES_OBJECT_STORE_REGION!,
  endpoint: process.env.ALCOVES_OBJECT_STORE_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.ALCOVES_OBJECT_STORE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.ALCOVES_OBJECT_STORE_SECRET_ACCESS_KEY!
  }
});