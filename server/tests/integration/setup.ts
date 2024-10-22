import { afterAll, beforeAll } from "bun:test";
import { eq } from "drizzle-orm";
import { db } from "../../src/db";
import { sessions, users } from "../../src/db/schema";

export const testUser = {
	id: "test-user-id",
	email: "test@alcoves.io",
	avatar: "https://example.com/avatar.jpg",
};

export const testSession = {
	userId: testUser.id,
	id: "mocked-secure-session-id",
	expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
};

export const testHeaders = {
	Cookie: `auth_session=${testSession.id}; HttpOnly; Secure`,
};

beforeAll(async () => {
	await db.transaction(async (tx) => {
		await tx.delete(users).where(eq(users.id, testUser.id));
		await tx.delete(sessions).where(eq(sessions.id, testSession.id));
	});

	await db.transaction(async (tx) => {
		await tx.insert(users).values(testUser);
		await tx.insert(sessions).values(testSession);
	});
});

afterAll(async () => {
	await db.transaction(async (tx) => {
		await tx.delete(users).where(eq(users.id, testUser.id));
		await tx.delete(sessions).where(eq(sessions.id, testSession.id));
	});
});
