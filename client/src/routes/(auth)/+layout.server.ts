import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { PRIVATE_ALCOVES_API_URL } from "$env/static/private";

export const load: LayoutServerLoad = async ({ fetch }) => {
	const res = await fetch(`${PRIVATE_ALCOVES_API_URL}/api/users/me`);
	if (!res.ok) return {};
	redirect(301, "/");
};
