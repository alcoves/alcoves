import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { Session, User } from "lucia";
import { lucia } from "../db/index";

export type UserAuthMiddleware = {
	authorization: {
		user: User;
		session: Session;
	};
};

export const userAuth = createMiddleware(async (c, next) => {
	const sessionId = getCookie(c, "auth_session");
	if (!sessionId) throw new HTTPException(401);

	const { session, user } = await lucia.validateSession(sessionId);
	if (!session || !user) throw new HTTPException(401);

	// If Session.fresh is true, it indicates the session expiration
	// has been extended and you should set a new session cookie.
	if (session?.fresh) {
		console.info("Refreshing session...");
		const refreshedSession = await lucia.createSession(user.id, {});
		const refreshedSessionCookie = lucia.createSessionCookie(refreshedSession.id);
		setCookie(
			c,
			refreshedSessionCookie.name,
			refreshedSessionCookie.value,
			refreshedSessionCookie.attributes,
		);
	}

	// If the session is refreshed would not using it here cause a bug?
	c.set("authorization", {
		user,
		session,
	});
	await next();
});
