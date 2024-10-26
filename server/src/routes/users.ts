import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { db } from "../db/db";
import { userAuth, type UserAuthMiddleware } from "../middleware/auth";
import { HTTPException } from "hono/http-exception";
const router = new Hono<{ Variables: UserAuthMiddleware }>();

router.use(userAuth);

router.get("/me", async (c) => {
	const { user } = c.get("authorization");

	const [userRecord] = await db.select({
		id: users.id,
		email: users.email,
		avatar: users.avatar,
		createdAt: users.createdAt,
		updatedAt: users.updatedAt,
	}).from(users).where(eq(users.id, user.id));

	if (!userRecord) throw new HTTPException(500) // Somehow the user is not in the database but they authenticated
	return c.json({ payload: userRecord });
});

export const usersRouter = router;
