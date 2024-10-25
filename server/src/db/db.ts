import { Pool } from "pg";
import * as schema from "./schema"    
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: process.env.ALCOVES_DB_URL!,
});

export const db = drizzle({ client: pool, schema });