import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	return { assets: ["test"] };
};

export const actions = {
	example: async () => {
		return { success: true };
	},
} satisfies Actions;
