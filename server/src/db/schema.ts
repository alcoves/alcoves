import { relations } from 'drizzle-orm'
import {
    text,
    serial,
    pgTable,
    timestamp,
    uuid,
    integer,
    pgEnum,
} from 'drizzle-orm/pg-core'

export const uploadStatusEnum = pgEnum('status', [
    'PENDING',
    'FAILED',
    'COMPLETED',
])

export const renditionStatusEnum = pgEnum('status', [
    'QUEUED',
    'PROCESSING',
    'FAILED',
    'COMPLETED',
])

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
    videos: many(videos),
    uploads: many(uploads),
    sessions: many(userSessions),
}))

export const userSessions = pgTable('user_sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    ip: text('ip').notNull().default('0.0.0.0'),
    userAgent: text('user_agent').notNull().default('Unknown'),
    userId: integer('user_id').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
    user: one(users, {
        references: [users.id],
        fields: [userSessions.userId],
    }),
}))

export const uploads = pgTable('uploads', {
    id: serial('id').primaryKey(),
    contentType: text('content_type').notNull(),
    size: integer('size').notNull().default(0),
    filename: text('filename').notNull(),
    status: uploadStatusEnum('status'),
    storageBucket: text('storage_bucket').notNull(),
    storageKey: text('storage_key').notNull(),
    userId: integer('user_id').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const uploadsRelations = relations(userSessions, ({ one }) => ({
    user: one(users, {
        references: [users.id],
        fields: [userSessions.userId],
    }),
}))

export const videos = pgTable('videos', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    storageBucket: text('storage_bucket').notNull(),
    storageKey: text('storage_key').notNull(),
    uploadId: integer('upload_id').references(() => uploads.id),
    userId: integer('user_id').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const videosRelations = relations(videos, ({ one, many }) => ({
    upload: one(uploads, {
        references: [uploads.id],
        fields: [videos.uploadId],
    }),
    user: one(users, {
        references: [users.id],
        fields: [videos.userId],
    }),
    renditions: many(videoRendition),
}))

export const videoRendition = pgTable('video_renditions', {
    id: serial('id').primaryKey(),
    storageBucket: text('storage_bucket').notNull(),
    storageKey: text('storage_key').notNull(),
    percentage: integer('percentage').notNull().default(0),
    status: renditionStatusEnum('status'),
    videoId: integer('video_id').references(() => videos.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const videoRenditionRelations = relations(videoRendition, ({ one }) => ({
    video: one(videos, {
        references: [videos.id],
        fields: [videoRendition.videoId],
    }),
}))

export type NewVideo = typeof videos.$inferInsert
export type NewUpload = typeof uploads.$inferInsert
