import postgres from 'postgres'
import * as schema from './schema'
import { drizzle } from 'drizzle-orm/postgres-js'

const client = postgres(process.env.ALCOVES_DB_CONNECTION_STRING || '')

export const db = drizzle(client, { schema })
