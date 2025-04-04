import { existsSync, mkdirSync, readFileSync } from "node:fs";

function isRunningInDocker(): boolean {
	let inDocker = false;
	try {
		if (existsSync("/.dockerenv")) {
			inDocker = true;
			return inDocker;
		}

		const cgroupContent = readFileSync("/proc/self/cgroup", "utf-8");
		return cgroupContent.includes("docker");
	} catch (error) {
		return false;
	}
}

export function getDataDirectory(): string {
	let dataDir = "";
	const ENV_OVERRIDE = process.env.ALCOVES_DATA_DIR;

	if (ENV_OVERRIDE) {
		dataDir = ENV_OVERRIDE;
	}

	if (isRunningInDocker()) {
		dataDir = "/data";
	} else {
		dataDir = `${process.cwd()}/../data`;
	}

	if (!existsSync(dataDir)) {
		mkdirSync(dataDir, { recursive: true });
	}

	return dataDir;
}

export function getAssetsDirectory(): string {
	const dataDir = getDataDirectory();
	const assetsDir = `${dataDir}/assets`;

	if (!existsSync(assetsDir)) {
		mkdirSync(assetsDir, { recursive: true });
	}

	return assetsDir;
}

export function getDatabasePath(): string {
	const dataDir = getDataDirectory();
	const databasePath = `${dataDir}/alcoves.db`;

	return databasePath;
}

console.info("Alcoves Data Directory:", getDataDirectory());
console.info("Database path:", getDatabasePath());
console.info("Assets path:", getAssetsDirectory());
console.info(
	`Alcoves is ${isRunningInDocker() ? "running in a container" : "not running in a container"}.`,
);
