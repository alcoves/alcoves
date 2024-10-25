import imageWorker from "./tasks/images";

export async function startWorkers() {
	console.info(`Starting workers`);

	console.info(`Starting image worker`);
	imageWorker();
}
