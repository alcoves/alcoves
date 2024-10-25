import { relations } from "drizzle-orm";
import { text, jsonb, integer, pgTable, timestamp, pgEnum, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial().primaryKey(),
	email: text("email").notNull().unique(),
	avatar: text("avatar"),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: integer("user_id"),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	assets: many(assets),
	sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const assetStatusEnum = pgEnum("status", [
	"UPLOADING",
	"UPLOADED",
	"PROCESSING",
	"READY",
	"ERROR",
]);

export const assets = pgTable("assets", {
	id: serial().primaryKey(),
	ownerId: text("owner_id"),
	title: text("title").notNull(),
	description: text("description"),
	metadata: jsonb("metadata"),
	size: integer("size").notNull(),
	storageKey: text("storage_key").notNull(),
	storageBucket: text("storage_bucket").notNull(),
	mimeType: text("mime_type").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetsRelations = relations(assets, ({ one }) => ({
	owner: one(users, {
		fields: [assets.ownerId],
		references: [users.id],
	}),
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;