import { Pool } from 'pg';
const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });

export default pool