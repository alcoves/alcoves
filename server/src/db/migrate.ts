import pc from 'picocolors'

import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

const pool = new Pool({
  connectionString: import.meta.env.ALCOVES_DB_URL!,
})

const db = drizzle(pool)

export const migrateDatabase = async () => {
  try {
    console.log(`${pc.green('Starting Database Migration')}`)
    await migrate(db, { migrationsFolder: './src/db/migrations' })
    console.log(`${pc.green('Migration Ended Successfully')}`)
  } catch (error) {
    console.error(`${pc.red('Database Migration Failed!')}`)
    console.error(error)
    process.exit(1)
  }
}
