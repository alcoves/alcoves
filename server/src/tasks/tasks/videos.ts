import { Worker } from "bullmq";
import { env } from "../../lib/env";
import { runFFmpeg } from "../../lib/ffmpeg";
import { bullConnection, transcodeQueue } from "../queues";

const worker = new Worker(
	transcodeQueue.name,
	async (job) => {
		switch (job.name) {
			case "transcode":
				console.log("Starting FFmpeg process.");
				await runFFmpeg({
					input: job.data.input,
					output: job.data.output,
					commands: job.data.commands,
					onProgress: async (progress, estimatedTimeRemaining) => {
						await job.updateProgress(progress);
						await job.updateData({
							...job.data,
							estimatedTimeRemaining,
						});
						console.log(
							`Progress: ${progress}% - Estimated Time Remaining: ${estimatedTimeRemaining}`,
						);
					},
				})
					.then(async () => {
						console.log("FFmpeg processing completed successfully.");
						await job.updateProgress(100);
					})
					.catch((error) => {
						console.error("FFmpeg processing failed:", error);
						throw new Error(error);
					});
				break;
			case "thumbnail":
				// Generate the signed url
				break;
			default:
				break;
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
