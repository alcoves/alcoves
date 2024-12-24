import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	email: text("email").notNull().unique(),
	avatar: text("avatar"),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: uuid("user_id"),
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

export const assets = pgTable("assets", {
	id: uuid().defaultRandom().primaryKey(),
	ownerId: uuid("owner_id").notNull(),
	title: text("title").notNull(),
	description: text("description"),
	status: text({
		enum: ["UPLOADING", "UPLOADED", "PROCESSING", "READY", "ERROR"],
	}),
	storageKey: text("storage_key").notNull(),
	storageBucket: text("storage_bucket").notNull(),

	proxy: text("proxy"), // One to one mapping to the proxy asset
	thumbnails: text("thumbnails"), // One to many mapping to the thumbnails

	// Original asset metadata
	metadata: jsonb("metadata"), // Metadata of the original asset. Either ffmpeg or exiftool metadata
	size: integer("size").notNull().default(0),
	width: integer("width").notNull().default(0),
	height: integer("height").notNull().default(0),
	duration: integer("duration").notNull().default(0),
	mimeType: text("mime_type").notNull(),

	// Time when asset was physically created
	cTime: timestamp("c_time").notNull().defaultNow(),

	deleted: boolean("deleted").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetsRelations = relations(assets, ({ one, many }) => ({
	thumbnails: many(assetThumbnails),
	proxy: one(assetProxy, {
		fields: [assets.proxyId],
		references: [assetProxy.id],
	}),
	owner: one(users, {
		fields: [assets.ownerId],
		references: [users.id],
	}),
}));

export const assetProxy = pgTable("asset_proxies", {
	id: uuid().defaultRandom().primaryKey(),
	assetId: uuid("asset_id"),
	type: text({ enum: ["HLS"] }).notNull(),
	progress: integer().notNull().default(0),
	status: text({ enum: ["PROCESSING", "READY", "ERROR"] }),
	storageKey: text("storage_key").notNull(),
	storageBucket: text("storage_bucket").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetThumbnails = pgTable("asset_thumbnails", {
	id: uuid().defaultRandom().primaryKey(),
	assetId: uuid("asset_id").notNull(),
	size: integer().notNull(),
	width: integer().notNull(),
	height: integer().notNull(),
	status: text({ enum: ["PROCESSING", "READY", "ERROR"] }),
	storageKey: text("storage_key").notNull(),
	storageBucket: text("storage_bucket").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetVideoProxies = pgTable("asset_video_proxies", {
	id: uuid().defaultRandom().primaryKey(),
	assetId: uuid("asset_id").notNull(),
	type: text({ enum: ["HLS"] }).notNull(),
	progress: integer().notNull().default(0),
	status: text({ enum: ["PROCESSING", "READY", "ERROR"] }),
	storageKey: text("storage_key").notNull(),
	storageBucket: text("storage_bucket").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assetImageProxiesRelations = relations(
	assetImageProxies,
	({ one }) => ({
		asset: one(assets, {
			fields: [assetImageProxies.assetId],
			references: [assets.id],
		}),
	}),
);

export const assetVideoProxiesRelations = relations(
	assetVideoProxies,
	({ one }) => ({
		asset: one(assets, {
			fields: [assetVideoProxies.assetId],
			references: [assets.id],
		}),
	}),
);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
