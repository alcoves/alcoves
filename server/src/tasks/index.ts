import imageWorker from "./tasks/images";
import videoWorker from "./tasks/videos";

export async function startWorkers() {
	console.info(`Starting workers`);

	console.info(`Starting image worker`);
	imageWorker();

	console.info(`Starting image worker`);
	videoWorker();
}
