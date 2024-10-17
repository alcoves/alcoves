import * as schema from './schema'

import { Client } from 'pg'
import { Lucia } from 'lucia'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'

const connection = new Client({
  connectionString: import.meta.env.ALCOVES_DB_URL!,
})

connection.connect()

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
