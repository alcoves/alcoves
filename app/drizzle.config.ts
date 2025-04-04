import type { Config } from "drizzle-kit";
import { getDatabasePath } from "./src/lib/server/utils";

export default {
	schema: "./src/lib/server/db/schema.ts",
	out: "./src/lib/server/db/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: `file:${getDatabasePath()}`,
	},
	verbose: true,
	strict: true,
} satisfies Config;
