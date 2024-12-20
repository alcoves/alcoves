import { eq } from "drizzle-orm";
import { db } from "../../../src/db/db";
import app from "../../../src/index";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { users } from "../../../src/db/schema";

describe("Auth:: Create Account", () => {
	const temporaryAuthUser = {
		email: "user@example.com",
		password: "password",
	};

	beforeEach(async () => {
		await db.delete(users).where(eq(users.email, temporaryAuthUser.email));
	});

	afterEach(async () => {
		await db.delete(users).where(eq(users.email, temporaryAuthUser.email));
	});

	test("Create Account, Login, Logout", async () => {
		const createRes = await app.request("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(temporaryAuthUser),
		});
		expect(createRes.status).toBe(200);
		const createResponseBody = await createRes.json();
		expect(createResponseBody).toEqual(
			expect.objectContaining({
				message: "Successfully signed up",
			}),
		);

		const loginRes = await app.request("/api/auth/login", {
			method: "POST",
			body: JSON.stringify(temporaryAuthUser),
			headers: { "Content-Type": "application/json" },
		});
		expect(loginRes.status).toBe(200);
		const loginResponseBody = await loginRes.json();
		expect(loginResponseBody).toEqual(
			expect.objectContaining({
				message: "Successfully logged in",
			}),
		);

		const loginCookie = loginRes.headers.get("set-cookie") || "";
		expect(loginCookie).toContain("session=");

		const sessionCookie = loginCookie.split("session=")[1].split(";")[0];
		expect(sessionCookie).toBeDefined();
		console.log(sessionCookie);

		const logoutRes = await app.request("/api/auth/logout", {
			method: "POST",
			body: JSON.stringify(temporaryAuthUser),
			headers: { "Content-Type": "application/json", Cookie: `session=${sessionCookie}` },
		});
		expect(logoutRes.status).toBe(200);
		const logoutResponseBody = await logoutRes.json();
		expect(logoutResponseBody).toEqual(
			expect.objectContaining({
				message: "Successfully logged out",
			}),
		);
	});

	test("POST /api/auth/signup :: BadParameters", async () => {
		const res = await app.request("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				emil: "",
				pa$$word: "",
			}),
		});
		expect(res.status).toBe(400);
		const responseBody = await res.json();
		expect(responseBody).toEqual(
			expect.objectContaining({
				error: {
					issues: [
						{
							code: "invalid_type",
							expected: "string",
							message: "Required",
							path: ["email"],
							received: "undefined",
						},
						{
							code: "invalid_type",
							expected: "string",
							message: "Required",
							path: ["password"],
							received: "undefined",
						},
					],
					name: "ZodError",
				},
				success: false,
			}),
		);
	});
});
