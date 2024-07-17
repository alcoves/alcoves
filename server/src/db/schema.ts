import { text, pgTable, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').unique().notNull(),
    avatar: text('avatar'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
})

export const assets = pgTable('assets', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    title: text('title').notNull(),
    description: text('description'),
    metadata: jsonb('metadata'),
    size: integer('size').notNull(),
    storageKey: text('storage_key').notNull(),
    storageBucket: text('storage_bucket').notNull(),
    contentType: text('content_type').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
