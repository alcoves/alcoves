import { describe, expect, test } from "bun:test";
import app from "../../../src/index";
import { testHeaders, testUser } from "../setup";

describe("Users", () => {
	test("GET /api/users/me", async () => {
		const res = await app.request("/api/users/me", {
			headers: testHeaders,
		});
		expect(res.status).toBe(200);
		const responseBody = await res.json();
		expect(responseBody).toEqual(
			expect.objectContaining({
				payload: {
					id: testUser.id,
					email: "test@alcoves.io",
					avatar: "https://example.com/avatar.jpg",
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			}),
		);
	});
});
