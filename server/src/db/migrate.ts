import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

const pool = new Pool({
    connectionString: process.env.ALCOVES_DB_CONNECTION_STRING,
})

const db = drizzle(pool)

async function main() {
    console.log('Migration started...')
    await migrate(db, { migrationsFolder: './src/db/migrations' })
    console.log('Migration ended...')
    // process.exit(0)
}

main().catch((err) => {
    console.log(err)
    // process.exit(0)
})
