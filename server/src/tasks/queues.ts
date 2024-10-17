import { env } from "../lib/env";
import { Queue } from "bullmq";

const transcodeQueueName = "transcode";
const imageProcessingQueueName = "images";

export enum ImageTasks {
	FETCH_IMAGE_METADATA = "fetch_image_metadata",
	GENERATE_IMAGE_PROXIES = "generate_image_proxies",
}

export const bullConnection = {
	host: env.ALCOVES_TASK_DB_HOST,
	port: Number.parseInt(env.ALCOVES_TASK_DB_PORT),
};

export const transcodeQueue = new Queue(transcodeQueueName, {
	connection: bullConnection,
});

export const imageProcessingQueue = new Queue(imageProcessingQueueName, {
	connection: bullConnection,
});
