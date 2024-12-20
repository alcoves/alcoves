import app from "../../src";
import { eq } from "drizzle-orm";
import { db } from "../../src/db/db";
import { users } from "../../src/db/schema";
import { afterAll, beforeAll } from "bun:test";

declare global {
	var testUser: typeof userData;
}

const userData = {
	email: "test@alcoves.io",
	password: "password",
	apiHeaders: {},
};

beforeAll(async () => {
	await db.delete(users).where(eq(users.email, userData.email));

	const createRes = await app.request("/api/auth/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: userData.email,
			password: userData.password,
		}),
	});

	const loginCookie = createRes.headers.get("set-cookie") || "";
	const sessionCookie = loginCookie.split("session=")[1].split(";")[0];

	global.testUser = {
		...userData,
		apiHeaders: {
			"Content-Type": "application/json",
			Cookie: `session=${sessionCookie}`,
		},
	};
});

afterAll(async () => {
	await db.delete(users).where(eq(users.email, userData.email));
});
