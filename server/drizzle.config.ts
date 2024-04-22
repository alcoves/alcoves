import type { Config } from 'drizzle-kit'

export default {
    out: './drizzle',
    schema: './src/db/schema.ts',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.ALCOVES_DB_CONNECTION_STRING || '',
    },
} satisfies Config
