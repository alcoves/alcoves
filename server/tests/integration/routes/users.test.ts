import { describe, expect, test } from "bun:test";
import app from "../../../src/index";

describe("Users", () => {
	test("GET /api/users/me", async () => {
		const res = await app.request("/api/users/me", {
			headers: testUser.apiHeaders,
		});
		expect(res.status).toBe(200);
		const { payload } = await res.json();
		console.log(payload)
		expect(payload.passwordHash).toBeUndefined();
		expect(payload).toMatchObject({
				avatar: null,
				id: expect.any(Number),
				email: testUser.email,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			})
	});
});
