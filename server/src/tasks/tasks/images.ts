import sharp from "sharp";
import { join } from "path";
import { tmpdir } from "os";
import { Worker } from "bullmq";
import { env } from "../../lib/env";
import { rm, mkdtemp } from "node:fs/promises";
import { downloadObject, uploadBufferToS3 } from "../../lib/s3";
import { ImageTasks, bullConnection, imageProcessingQueue } from "../queues";

async function main() {
	const worker = new Worker(
		imageProcessingQueue.name,
		async (job) => {
			const tmpDir = await mkdtemp(join(tmpdir(), "alcoves-"));
			console.info(`Created temporary directory: ${tmpDir}`);

			try {
				switch (job.name) {
					case ImageTasks.GENERATE_IMAGE_PROXIES:
						console.log("Image proxy Job");
						break;
					case ImageTasks.FETCH_IMAGE_METADATA:
						console.info("Downloading image", job.data);
						const imagePath = await downloadObject({
							localDir: tmpDir,
							key: job.data.key,
							bucket: job.data.bucket,
						});
						console.info("Parsing metadata");
						const metadata = await sharp(imagePath).metadata();
						// console.log(JSON.stringify(metadata, null, 2))

						const compressedImage = await sharp(imagePath)
							.resize({
								width: 400,
							})
							.avif({
								quality: 50,
								// progressive: true,
							})
							.toBuffer();

						console.info("Uploading compressed image");
						const url = await uploadBufferToS3({
							imageBuffer: compressedImage,
							bucket: job.data.bucket,
							key: "test.jpg",
						});

						// Update database
						break;
					default:
						break;
				}
			} catch (error) {
				console.error("Error processing image", error);
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

	console.info(`Starting worker: ${worker.name} for queue: ${imageProcessingQueue.name}`);
}

export default main;
