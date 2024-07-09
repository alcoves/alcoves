import { db, connection } from './db'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

console.info('Running database migrations...')
await migrate(db, { migrationsFolder: './src/db/migrations' })
await connection.end()
console.info('Database migrations complete.')
