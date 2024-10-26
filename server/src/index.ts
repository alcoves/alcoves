import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { assetsRouter } from "./routes/assets";
import { authRouter } from "./routes/auth";
import { rootRouter } from "./routes/root";
import { usersRouter } from "./routes/users";
import { startWorkers } from "./tasks";
import { migrateDatabase } from "./db/migrate";

const app = new Hono();

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
			origin: "http://localhost:5173",
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

export default app;
