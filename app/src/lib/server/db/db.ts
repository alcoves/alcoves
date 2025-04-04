import { ALCOVES_DB_PATH } from "$env/static/private";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

export const db = drizzle(ALCOVES_DB_PATH, { schema });
