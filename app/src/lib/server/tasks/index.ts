import assetWorker from './workers/assets'

export async function startWorkers() {
	assetWorker();
}