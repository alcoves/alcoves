import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
} from "$lib/server/auth/session";
import { db } from "$lib/server/db/db";
import { users } from "$lib/server/db/schema";
import { fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { Actions } from "./$types";

export const actions = {
	default: async (event) => {
		const { request } = event;
		const data = await request.formData();
		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();
		if (!email || !password) throw new Error("Null email or password");

		const alreadyHasUser = await db.select().from(users).limit(1);
		const isFirstUser = Boolean(alreadyHasUser.length === 0);

		const [user] = await db.select().from(users).where(eq(users.email, email));

		if (user) {
			return fail(400, { error: "User already exists" });
		}

		const passwordHash = await Bun.password.hash(password);

		const [newUser] = await db
			.insert(users)
			.values({
				email,
				passwordHash,
				role: isFirstUser ? "ADMIN" : "USER",
			})
			.returning();

		const token = generateSessionToken();
		const session = await createSession(token, newUser.id);
		setSessionTokenCookie(event, token, session.expiresAt);
		return { success: true };
	},
} satisfies Actions;
