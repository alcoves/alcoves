import postgres from 'postgres'
import * as schema from './schema'

import { drizzle } from 'drizzle-orm/postgres-js'

export const connection = postgres(
    process.env.ALCOVES_DB_CONNECTION_STRING as string,
    {
        max: 1,
    }
)

export const db = drizzle(connection, { schema })
