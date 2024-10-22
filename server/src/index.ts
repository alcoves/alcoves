import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { migrateDatabase } from "./db/migrate";
import { assetsRouter } from "./routes/assets";
import { authRouter } from "./routes/auth";
import { rootRouter } from "./routes/root";
import { usersRouter } from "./routes/users";
import { startWorkers } from "./tasks";

const app = new Hono();

async function main() {
	await migrateDatabase();
	await startWorkers();

	app.use(logger());

	const defaultCorsOptions = {
		origin: "*",
		credentials: true,
		allowHeaders: [],
		exposeHeaders: ["Content-Length"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	};

	if (process.env.NODE_ENV !== "production") {
		app.use(
			cors({
				...defaultCorsOptions,
				origin: "http://localhost:3005",
			}),
		);
	} else {
		app.use(cors(defaultCorsOptions));
	}

	app.use("/favicon.ico", serveStatic({ path: "./src/static/favicon.ico" }));

	app.route("/", rootRouter);
	app.route("/api/auth", authRouter);
	app.route("/api/users", usersRouter);
	app.route("/api/assets", assetsRouter);

	app.use(
		"*",
		serveStatic({
			root: "./src/",
			rewriteRequestPath: (path) => path.replace(/^\//, "/static"),
		}),
	);
}

main();

export default app;
