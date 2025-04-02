import type { Config } from "drizzle-kit";

export const ALCOVES_DB_PATH =
	process.env.ALCOVES_DB_PATH || "../data/alcoves.db";

export default {
	schema: "./src/lib/server/db/schema.ts",
	out: "./src/lib/server/db/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: `file:${ALCOVES_DB_PATH}`,
	},
	verbose: true,
	strict: true,
} satisfies Config;
