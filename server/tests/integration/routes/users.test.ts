import app from "../../../src/index";
import { expect, test, describe } from "bun:test";
import { testSession, testUser } from "../setup";

describe("Users", () => {
	test("GET /api/users/me", async () => {
		const res = await app.request("/api/users/me", {
			headers: {
				Cookie: `auth_session=${testSession.id}; HttpOnly; Secure`,
			},
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
