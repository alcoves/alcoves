import { relations } from "drizzle-orm";
import { text, jsonb, integer, pgTable, timestamp, pgEnum, serial, boolean } from "drizzle-orm/pg-core";

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
	ownerId: integer("owner_id"),
	title: text("title").notNull(),
	description: text("description"),
	metadata: jsonb("metadata"),
	size: integer("size").notNull(),
	storageKey: text("storage_key").notNull(),
	storageBucket: text("storage_bucket").notNull(),
	mimeType: text("mime_type").notNull(),
	trashed: boolean("trashed").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetsRelations = relations(assets, ({ one, many }) => ({
	assetImageProxies: many(assetImageProxies),
	owner: one(users, {
		fields: [assets.ownerId],
		references: [users.id],
	}),
}));

export const assetImageProxies = pgTable("asset_image_proxies", {
	id: serial().primaryKey(),
	assetId: integer("asset_id").notNull(),
	size: integer().notNull(),
	width: integer().notNull(),
	height: integer().notNull(),
	storageKey: text("storage_key").notNull(),
	storageBucket: text("storage_bucket").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetImageProxiesRelations = relations(assetImageProxies, ({ one }) => ({
	asset: one(assets, {
		fields: [assetImageProxies.assetId],
		references: [assets.id],
	})
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;