import sharp from "sharp";
import { join } from "path";
import { tmpdir } from "os";
import { Job, Worker } from "bullmq";
import { env } from "../../lib/env";
import { rm, mkdtemp, mkdir } from "node:fs/promises";
import { downloadObject, getPresignedUrl, s3InternalClient, uploadDirectoryToS3, uploadFileToS3 } from "../../lib/s3";
import { VideoTasks, bullConnection, videoProcessingQueue } from "../queues";
import { db } from "../../db/db";
import { assetImageProxies, assetVideoProxies } from "../../db/schema";
import { v4 as uuid } from "uuid";
import { runFFmpeg } from "../../lib/ffmpeg";
import { eq } from "drizzle-orm";

export interface VideoProxyJobData {
	assetId: number;
	sourceKey: string;
	sourceBucket: string;
}

export interface VideoThumbnailJobData {
	assetId: number;
	sourceKey: string;
	sourceBucket: string;
}

interface VideoProxyJob extends Job {
	name: VideoTasks;
	data: VideoProxyJobData;
}

async function main() {
	const worker = new Worker(
		videoProcessingQueue.name,
		async (job: VideoProxyJob) => {
			const tmpDir = await mkdtemp(join(tmpdir(), "alcoves-"));
			console.info(`Created temporary directory: ${tmpDir}`);

			try {
				if (job.name === VideoTasks.GENERATE_VIDEO_PROXIES) {
					const proxyStorageId = uuid();
					const proxyStorageFolder = join(tmpDir, proxyStorageId);
					await mkdir(proxyStorageFolder, { recursive: true });

					const proxyStorageBucket = env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET;
					const proxyStorageKey = `${env.ALCOVES_OBJECT_STORE_PROXIES_PREFIX}/${proxyStorageId}`;
					const mainPlaylistName = "main.m3u8";
					const mainPlaylistKey = `${proxyStorageKey}/${mainPlaylistName}`;

					const assetVideoProxy = await db.insert(assetVideoProxies).values({
						type: "HLS",
						assetId: job.data.assetId,
						storageBucket: proxyStorageBucket,
						storageKey: mainPlaylistKey
					}).returning();

					const sourceFileUrl = await getPresignedUrl({
						client: s3InternalClient,
						key: job.data.sourceKey,
						bucket: job.data.sourceBucket,
					});

					const commands = [
						"-map", "0:v",
						"-map", "0:a",
						"-vf", "scale=-2:720",
						"-c:v", "libsvtav1",
						"-crf", "36",
						"-preset", "8",
						"-g", "300",
						"-c:a", "libopus",
						"-b:a", "128k",
						"-ac", "2",
						"-f", "hls",
						"-hls_time", "6",
						"-hls_list_size", "0",
						"-hls_segment_filename", `${proxyStorageFolder}/stream_%v_%03d.m4s`,
						"-hls_fmp4_init_filename", "stream_%v_init.mp4",
						"-var_stream_map", "v:0,name:video a:0,name:audio",
						"-hls_flags", "delete_segments+independent_segments",
						"-master_pl_name", mainPlaylistName,
						"-hls_playlist_type", "event"
					];

					console.log("Starting FFmpeg process.");
					await runFFmpeg({
						input: sourceFileUrl,
						output: `${proxyStorageFolder}/stream_%v.m3u8`,
						commands,
						onProgress: async (progress, estimatedTimeRemaining) => {
							await job.updateProgress(progress);
							await job.updateData({
								...job.data,
								estimatedTimeRemaining,
							});
							await db.update(assetVideoProxies)
								.set({ 
									status: "PROCESSING",
									progress: progress,
									updatedAt: new Date(),
								})
								.where(eq(assetVideoProxies.id, assetVideoProxy[0].id));

							console.log(
								`Progress: ${progress}% - Estimated Time Remaining: ${estimatedTimeRemaining}`,
							);
						},
					})
						.then(async () => {
							console.log("FFmpeg processing completed successfully.");
							await job.updateProgress(100);

							const locations = await uploadDirectoryToS3({
								dirPath: proxyStorageFolder,
								prefix: proxyStorageKey,
								bucket: proxyStorageBucket,
							});

							await db.update(assetVideoProxies)
								.set({ 
									status: "READY",
									progress: 100,
									updatedAt: new Date(),
								})
								.where(eq(assetVideoProxies.id, assetVideoProxy[0].id));

						})
						.catch(async (error) => {
							console.error("FFmpeg processing failed:", error);
							// Update record with error status
							await db.update(assetVideoProxies)
								.set({ 
									status: "ERROR",
									updatedAt: new Date(),
								})
								.where(eq(assetVideoProxies.id, assetVideoProxy[0].id));

							throw new Error(error);
						});
				} else if (job.name === VideoTasks.GENERATE_VIDEO_THUMBNAIL) {
					const proxyStorageId = uuid();
					const proxyStorageName = `${proxyStorageId}.avif`;
					const proxyStorageBucket = env.ALCOVES_OBJECT_STORE_DEFAULT_BUCKET;
					const proxyStorageKey = `${env.ALCOVES_OBJECT_STORE_ASSETS_PREFIX}/${job.data.assetId}/thumbnails/${proxyStorageName}`;
					const thumbnailPath = join(tmpDir, "thumbnail.png");

					const sourceFileUrl = await getPresignedUrl({
						client: s3InternalClient,
						key: job.data.sourceKey,
						bucket: job.data.sourceBucket,
					});

					await runFFmpeg({
						input: sourceFileUrl,
						output: thumbnailPath,
						commands: [
							"-vf", "thumbnail",
							"-frames:v", "1",
							"-q:v", "2",
						],
					});

					const compressedImageLocalPath = join(tmpDir, proxyStorageName);
					const compressedImage = await sharp(thumbnailPath)
								.resize({ width: 400, })
								.avif({ quality: 65, })
								.rotate()
								.toFile(compressedImageLocalPath);

					const assetVideoThumbnail = await db.insert(assetImageProxies).values({
						size: compressedImage.size,
						height: compressedImage.height,
						width: compressedImage.width,
						assetId: job.data.assetId,
						storageBucket: proxyStorageBucket,
						storageKey: proxyStorageKey
					}).returning();
				}
			} catch (error) {
				console.error("Error processing video", error);
				throw error;
			} finally {
				console.info("Removing temporary directory");
				rm(tmpDir, { recursive: true, force: true });
			}
		},
		{
			connection: bullConnection,
			concurrency: Number.parseInt(env.ALCOVES_TASK_WORKER_CONCURRENCY || "1"),
		},
	);

	worker.on("completed", (job) => {
		console.log(`${job.id} has completed!`);
	});

	worker.on("failed", (job, err) => {
		console.log(`${job?.id} has failed with ${err.message}`);
	});

	console.info(`Starting worker: ${worker.name} for queue: ${videoProcessingQueue.name}`);
}

export default main;