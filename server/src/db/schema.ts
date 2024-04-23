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

export const uploadStatusEnum = pgEnum('upload_status_enum', [
    'PENDING',
    'FAILED',
    'COMPLETED',
])

export const renditionStatusEnum = pgEnum('rendition_status_enum', [
    'QUEUED',
    'PROCESSING',
    'FAILED',
    'COMPLETED',
])

export const userRolesEnum = pgEnum('user_roles', ['OWNER', 'ADMIN', 'USER'])

export const alcoveRolesEnum = pgEnum('alcove_roles', [
    'OWNER',
    'ADMIN',
    'USER',
])

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    role: userRolesEnum('role').notNull().default('USER'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
    videos: many(videos),
    uploads: many(uploads),
    sessions: many(userSessions),
    alcoves: many(alcoveMemberships),
}))

export const userSessions = pgTable('user_sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    ip: text('ip').notNull().default('0.0.0.0'),
    userAgent: text('user_agent').notNull().default('Unknown'),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
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
    status: uploadStatusEnum('status').notNull().default('PENDING'),
    storageBucket: text('storage_bucket').notNull(),
    storageKey: text('storage_key').notNull(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
    alcoveId: integer('alcove_id')
        .notNull()
        .references(() => alcoves.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const uploadsRelations = relations(uploads, ({ one }) => ({
    user: one(users, {
        references: [users.id],
        fields: [uploads.userId],
    }),
    alcove: one(alcoves, {
        references: [alcoves.id],
        fields: [uploads.userId],
    }),
}))

export const videos = pgTable('videos', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    storageBucket: text('storage_bucket').notNull(),
    storageKey: text('storage_key').notNull(),
    uploadId: integer('upload_id')
        .notNull()
        .references(() => uploads.id),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
    alcoveId: integer('alcoves_id')
        .notNull()
        .references(() => alcoves.id),
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
    alcove: one(alcoves, {
        references: [alcoves.id],
        fields: [videos.alcoveId],
    }),
    renditions: many(videoRendition),
}))

export const videoRendition = pgTable('video_renditions', {
    id: serial('id').primaryKey(),
    storageBucket: text('storage_bucket').notNull(),
    storageKey: text('storage_key').notNull(),
    percentage: integer('percentage').notNull().default(0),
    status: renditionStatusEnum('status').notNull().default('QUEUED'),
    videoId: integer('video_id')
        .notNull()
        .references(() => videos.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const videoRenditionRelations = relations(videoRendition, ({ one }) => ({
    video: one(videos, {
        references: [videos.id],
        fields: [videoRendition.videoId],
    }),
}))

export const alcoves = pgTable('alcoves', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const alcoveRelations = relations(alcoves, ({ many }) => ({
    videos: many(videos),
    uploads: many(uploads),
}))

export const alcoveMemberships = pgTable('alcove_memberships', {
    id: serial('id').primaryKey(),
    alcoveId: integer('alcove_id')
        .notNull()
        .references(() => alcoves.id),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
    role: alcoveRolesEnum('role').notNull().default('USER'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const alcoveMembershipRelations = relations(
    alcoveMemberships,
    ({ one }) => ({
        alcove: one(alcoves, {
            references: [alcoves.id],
            fields: [alcoveMemberships.alcoveId],
        }),
        user: one(users, {
            references: [users.id],
            fields: [alcoveMemberships.userId],
        }),
    })
)

export type NewVideo = typeof videos.$inferInsert
export type NewUpload = typeof uploads.$inferInsert
