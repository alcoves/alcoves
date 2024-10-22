import { describe, expect, test } from "bun:test";
import app from "../../../src/index";
import { testHeaders, testUser } from "../setup";

describe("Users", () => {
	test("GET /api/assets", async () => {
		const res = await app.request("/api/assets", {
			headers: testHeaders,
		});
		expect(res.status).toBe(200);
		const responseBody = await res.json();
		expect(responseBody).toEqual(
			expect.objectContaining({
				status: "ok",
			}),
		);
	});

	test("POST /api/assets", async () => {
		const res = await app.request("/api/assets", {
			method: "POST",
			headers: testHeaders,
		});
		expect(res.status).toBe(200);
		const responseBody = await res.json();
		expect(responseBody).toEqual(
			expect.objectContaining({
				status: "ok",
			}),
		);
	});

	test("DELETE /api/assets", async () => {
		const res = await app.request("/api/assets", {
			method: "DELETE",
			headers: testHeaders,
		});
		expect(res.status).toBe(200);
		const responseBody = await res.json();
		expect(responseBody).toEqual(
			expect.objectContaining({
				status: "ok",
			}),
		);
	});

	test("PATCH /api/assets/:assetId", async () => {
		const res = await app.request("/api/assets/123", {
			method: "PATCH",
			headers: testHeaders,
		});
		expect(res.status).toBe(200);
		const responseBody = await res.json();
		expect(responseBody).toEqual(
			expect.objectContaining({
				status: "ok",
			}),
		);
	});
});
