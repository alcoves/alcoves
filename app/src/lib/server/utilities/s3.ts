import { createReadStream, createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import {
	GetObjectCommand,
	type GetObjectCommandOutput,
	S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime";
import { env } from "./env";

const pipelineAsync = promisify(pipeline);

export const ASSET_STORAGE_PREFIX = "assets";

export const s3Client = new S3Client({
	region: env.ALCOVES_OBJECT_STORE_REGION!,
	endpoint: env.ALCOVES_OBJECT_STORE_ENDPOINT!,
	forcePathStyle: true,
	credentials: {
		accessKeyId: env.ALCOVES_OBJECT_STORE_ACCESS_KEY_ID!,
		secretAccessKey: env.ALCOVES_OBJECT_STORE_SECRET_ACCESS_KEY!,
	},
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

	const command = new GetObjectCommand({ Bucket: bucket, Key: key });
	const response = await s3Client.send(command);
	await pipelineAsync(
		response.Body as unknown as NodeJS.ReadableStream,
		createWriteStream(downloadPath),
	);
	console.log(
		`Successfully downloaded ${key} from ${bucket} to ${downloadPath}`,
	);

	return downloadPath;
}

async function* getFilesRecursively(dir: string): AsyncGenerator<string> {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* getFilesRecursively(fullPath);
		} else {
			yield fullPath;
		}
	}
}

export async function uploadDirectoryToS3({
	dirPath,
	bucket,
	prefix = "",
}: {
	dirPath: string;
	bucket: string;
	prefix?: string;
}): Promise<Array<{ location: string; key: string }>> {
	const uploads: Promise<{ location: string; key: string }>[] = [];

	try {
		for await (const filePath of getFilesRecursively(dirPath)) {
			// Create S3 key preserving directory structure
			const relativePath = relative(dirPath, filePath);
			const key = prefix ? join(prefix, relativePath) : relativePath;

			// Queue upload
			uploads.push(
				uploadFileToS3({
					filePath,
					bucket,
					key,
					contentType: mime.getType(filePath) || "application/octet-stream",
				}),
			);
		}

		// Upload all files concurrently
		const results = await Promise.all(uploads);
		return results;
	} catch (error) {
		console.error("Directory upload failed:", error);
		throw error;
	}
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

export async function getObjectFromS3({
	bucket,
	key,
}: {
	bucket: string;
	key: string;
}): Promise<GetObjectCommandOutput> {
	try {
		const command = new GetObjectCommand({ Bucket: bucket, Key: key });
		return s3Client.send(command);
	} catch (error) {
		console.error("Failed to get object from S3:", error);
		throw error;
	}
}
