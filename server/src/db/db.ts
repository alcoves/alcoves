import postgres from 'postgres'
import * as schema from './schema'

import { Lucia } from 'lucia'
import { drizzle } from 'drizzle-orm/postgres-js'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'

export const connection = postgres(
    process.env.ALCOVES_DB_CONNECTION_STRING as string
)

export const migrationConnection = postgres(
    process.env.ALCOVES_DB_CONNECTION_STRING as string,
    {
        max: 1,
    }
)

export const db = drizzle(connection, { schema })

const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessions, schema.users)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === 'production',
        },
    },
})

// IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia
    }
}
