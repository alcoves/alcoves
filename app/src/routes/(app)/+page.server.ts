import { type Actions, fail } from "@sveltejs/kit";
import {
  S3Client,
  UploadPartCommand,
  AbortMultipartUploadCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";

const CHUNK_SIZE = 25 * 1024 * 1024; // 25MB chunks

const internalS3Client = new S3Client({
  region: process.env.ALCOVES_OBJECT_STORE_REGION!,
	endpoint: process.env.ALCOVES_OBJECT_STORE_ENDPOINT!,
	forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.ALCOVES_OBJECT_STORE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.ALCOVES_OBJECT_STORE_SECRET_ACCESS_KEY!
  }
});

export const actions = {
  upload: async ({ request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());
      const { file } = formData as { file: File };
      
      if (!file?.name || file.name === "undefined") {
        return fail(400, { error: true, message: "Invalid file" });
      }

      const key = `uploads/${Date.now()}-${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Start multipart upload
      const multipartUpload = await internalS3Client.send(new CreateMultipartUploadCommand({
        Bucket: process.env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET!,
        Key: key,
        ContentType: file.type
      }));

      const uploadId = multipartUpload.UploadId!;
      const parts: { ETag: string; PartNumber: number; }[] = [];

      try {
        // Upload parts in parallel
        const chunkPromises = [];
        let partNumber = 1;
        
        for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
          const chunk = buffer.slice(i, Math.min(i + CHUNK_SIZE, buffer.length));
          
          const uploadPartCommand = new UploadPartCommand({
            Bucket: process.env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET!,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber,
            Body: chunk
          });

          const promise = internalS3Client.send(uploadPartCommand)
            .then(response => {
              parts.push({
                ETag: response.ETag!,
                PartNumber: partNumber
              });
            });

          chunkPromises.push(promise);
          partNumber++;
        }

        await Promise.all(chunkPromises);

        // Complete multipart upload
        await internalS3Client.send(new CompleteMultipartUploadCommand({
          Bucket: process.env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET!,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber) }
        }));

        return { success: true, key };

      } catch (error) {
        // Abort multipart upload on failure
        await internalS3Client.send(new AbortMultipartUploadCommand({
          Bucket: process.env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET!,
          Key: key,
          UploadId: uploadId
        }));
        throw error;
      }

    } catch (error) {
      console.error("Upload error:", error);
      return fail(500, { error: true, message: "Upload failed" });
    }
  }
} satisfies Actions;