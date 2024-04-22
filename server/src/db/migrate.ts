import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'

const ALCOVES_DB_CONNECTION_STRING = process.env.ALCOVES_DB_CONNECTION_STRING

if (!ALCOVES_DB_CONNECTION_STRING) {
    throw new Error('ALCOVES_DB_CONNECTION_STRING is not set')
}

const migrationClient = postgres(ALCOVES_DB_CONNECTION_STRING, { max: 1 })
const db: PostgresJsDatabase = drizzle(migrationClient)

const main = async () => {
    console.log('Migrating database...')
    await migrate(db, { migrationsFolder: './drizzle' })
    await migrationClient.end()
    console.log('Database migrated successfully!')
}

main()
