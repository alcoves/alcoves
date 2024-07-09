import {
    // integer,
    // pgEnum,
    pgTable,
    serial,
    // uniqueIndex,
    varchar,
} from 'drizzle-orm/pg-core'

// // declaring enum in database
// export const popularityEnum = pgEnum('popularity', [
//     'unknown',
//     'known',
//     'popular',
// ])

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 320 }).unique(),
})

// export const cities = pgTable('cities', {
//     id: serial('id').primaryKey(),
//     name: varchar('name', { length: 320 }),
//     countryId: integer('country_id').references(() => countries.id),
//     popularity: popularityEnum('popularity'),
// })
