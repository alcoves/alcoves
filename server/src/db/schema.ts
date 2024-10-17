import { relations } from 'drizzle-orm'
import {
    text,
    jsonb,
    integer,
    pgTable,
    timestamp,
    pgEnum,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    avatar: text('avatar'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id'),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
    assets: many(assets),
    sessions: many(sessions),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}))

export const assetStatusEnum = pgEnum('status', [
    'UPLOADING',
    'UPLOADED',
    'PROCESSING',
    'READY',
    'ERROR',
])

export const assets = pgTable('assets', {
    id: text('id').primaryKey(),
    ownerId: text('owner_id'),
    title: text('title').notNull(),
    description: text('description'),
    metadata: jsonb('metadata'),
    size: integer('size').notNull(),
    storageKey: text('storage_key').notNull(),
    storageBucket: text('storage_bucket').notNull(),
    mimeType: text('mime_type').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const assetsRelations = relations(assets, ({ one }) => ({
    owner: one(users, {
        fields: [assets.ownerId],
        references: [users.id],
    }),
}))

// generator client {
//   provider = "prisma-client-js"
// }

// datasource db {
//   provider = "postgresql"
//   url      = env("ALCOVES_DB_URL")
// }

// enum AssetType {
//   PHOTO
//   VIDEO
// }

// model User {
//   id        Int       @id @default(autoincrement())
//   email     String    @unique
//   avatar    String?
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt
//   Asset     Asset[]
//   Session   Session[]
// }

// model Session {
//   id        String   @id
//   expiresAt DateTime
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   userId    Int
//   user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
// }

// model Asset {
//   id          Int              @id @default(autoincrement())
//   type        AssetType
//   title       String
//   description String           @default("")
//   createdAt   DateTime         @default(now())
//   updatedAt   DateTime         @updatedAt
//   userId      Int
//   user        User             @relation(fields: [userId], references: [id])
//   // metadata    AssetMetadata?
//   renditions  AssetRendition[]
// }

// model AssetRendition {
//   id            Int       @id @default(autoincrement())
//   type          AssetType
//   size          Int
//   mimeType      String
//   metadata      Json?
//   storageKey    String
//   storageBucket String
//   createdAt     DateTime  @default(now())
//   updatedAt     DateTime  @updatedAt
//   asset         Asset     @relation(fields: [assetId], references: [id])
//   assetId       Int
// }

// // WIP
// // model AssetMetadata {
// //   id             Int      @id @default(autoincrement())
// //   filename       String
// //   width          Int      @default(0)
// //   height         Int      @default(0)
// //   duration       Int      @default(0)
// //   cameraMake     String
// //   cameraModel    String
// //   assetCreatedAt DateTime @default(now())
// //   createdAt      DateTime @default(now())
// //   updatedAt      DateTime @updatedAt
// //   asset          Asset    @relation(fields: [assetId], references: [id])
// //   assetId        Int      @unique
// // }
