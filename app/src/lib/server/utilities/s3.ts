import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { join } from "node:path";
import { pipeline } from "node:stream";
import { createReadStream, createWriteStream } from "node:fs";
import { promisify } from "node:util";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "./env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const pipelineAsync = promisify(pipeline);

export const ASSET_STORAGE_PREFIX = "assets";

export const s3Client = new S3Client({
  region: env.ALCOVES_OBJECT_STORE_REGION!,
  endpoint: env.ALCOVES_OBJECT_STORE_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.ALCOVES_OBJECT_STORE_ACCESS_KEY_ID!,
    secretAccessKey: env.ALCOVES_OBJECT_STORE_SECRET_ACCESS_KEY!
  }
});

export async function getPresignedUrl({
  client = s3Client,
  bucket,
  key,
  expiration = 3600,
}: {
  client?: S3Client;
  bucket: string;
  key: string;
  expiration?: number;
}): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn: expiration,
  });
}

export async function downloadObject({
  localDir,
  bucket,
  key,
}: {
  localDir: string;
  bucket: string;
  key: string;
}): Promise<string> {
  const downloadPath = join(localDir, "downloadedFile");

  console.log("Downloading object", key, "from", bucket, "to", downloadPath);

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3Client.send(command);
    await pipelineAsync(response.Body as unknown as NodeJS.ReadableStream, createWriteStream(downloadPath));
    console.log(`Successfully downloaded ${key} from ${bucket} to ${downloadPath}`);
  } catch (error) {
    throw error;
  }

  return downloadPath;
}

export async function uploadFileToS3({
  filePath,
  bucket,
  key,
  contentType,
}: {
  filePath: string;
  bucket: string;
  key: string;
  contentType: string;
}): Promise<{ location: string; key: string }> {
  try {
    const fileStream = createReadStream(filePath);
    const upload = new Upload({
      client: s3Client,
      params: {
        Key: key,
        Bucket: bucket,
        Body: fileStream,
        ContentType: contentType,
      },
    });

    const result = await upload.done();
    return {
      location: result.Location!,
      key: result.Key!,
    };
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}