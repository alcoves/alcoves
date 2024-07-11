import { db, migrationConnection } from './db'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

console.info('Running database migrations...')
await migrate(db, { migrationsFolder: './src/db/migrations' })

if (process.env.NODE_ENV === 'productioon') {
    // Close the connection in production so it doesn't hang.
    console.info('Closing migration connection...')
    await migrationConnection.end()
}

console.info('Database migrations complete.')
