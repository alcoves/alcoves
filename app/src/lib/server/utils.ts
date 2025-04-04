import { exists, mkdir, readFile } from "node:fs/promises";

async function isRunningInDocker(): Promise<boolean> {
	try {
		if (await exists("/.dockerenv")) {
			return true;
		}

		const cgroupContent = await readFile("/proc/self/cgroup", "utf-8");
		return cgroupContent.includes("docker");
	} catch (error) {
		return false;
	}
}

export async function getRootDirectory(): Promise<string> {
	const rootDir = (await isRunningInDocker()) ? "/data" : process.cwd();

	if (!(await exists(rootDir))) {
		await mkdir(rootDir, { recursive: true });
	}

	return rootDir;
}

export async function getAssetsDirectory(): Promise<string> {
	const rootDirectory = await getRootDirectory();
	const assetsDirectory = `${rootDirectory}/assets`;

	if (!(await exists(assetsDirectory))) {
		await mkdir(assetsDirectory, { recursive: true });
	}

	return `${rootDirectory}/assets`;
}
