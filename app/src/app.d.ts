import type { User } from "$lib/server/user";
import type { Session } from "$lib/server/auth/session";

declare global {
	namespace App {
		interface Locals {
			user: User | null; // Are these types correct?
			session: Session | null;  // Are these types correct?
		}
	}
}

export {};