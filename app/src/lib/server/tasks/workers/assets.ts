import { env } from "$lib/server/utilities/env";
import { type Job, Worker } from "bullmq";
import { AssetTasks, assetProcessingQueue, bullConnection } from "../queues";
import { generateVideoProxy } from "../tasks/generateVideoProxy";
import { generateVideoThumbnail } from "../tasks/generateVideoThumbnail";
import { ingestAsset } from "../tasks/ingestAsset";

export interface AssetJob extends Job {
	name: AssetTasks;
	data: {
		assetId: string;
	};
}

async function main() {
	const worker = new Worker(
		assetProcessingQueue.name,
		async (job: AssetJob) => {
			try {
				switch (job.name) {
					case AssetTasks.INGEST_ASSET:
						await ingestAsset(job);
						break;
					case AssetTasks.GENERATE_ASSET_VIDEO_PROXY:
						await generateVideoProxy(job);
						break;
					case AssetTasks.GENERATE_ASSET_VIDEO_THUMBNAIL:
						await generateVideoThumbnail(job);
						break;
					default:
						console.error(`Invalid job name: ${job.name}`);
						break;
				}
			} catch (error) {
				console.error("Worker Error:", error);
				throw error;
			}
		},
		{
			connection: bullConnection,
			concurrency: Number.parseInt(env.ALCOVES_TASK_WORKER_CONCURRENCY),
		},
	);

	worker.on("completed", (job) => {
		console.log(`${job.id} has completed!`);
	});

	worker.on("failed", (job, err) => {
		console.log(`${job?.id} has failed with ${err.message}`);
	});

	console.info(
		`Starting worker: ${worker.name} for queue: ${assetProcessingQueue.name}`,
	);
}

export default main;
