import { type Actions, fail } from "@sveltejs/kit";
import { writeFileSync } from "node:fs";

export const actions = {
	upload: async ({ request }) => {
		console.log("Handling backend file upload");
		const formData = Object.fromEntries(await request.formData());

		if (
			!(formData.file as File).name ||
			(formData.file as File).name === "undefined"
		) {
			return fail(400, {
				error: true,
				message: "You must provide a file to upload",
			});
		}

		const { file } = formData as { file: File };

		// // Write the file to the static folder
		// writeFileSync(
		// 	`./${file.name}`,
		// 	Buffer.from(await file.arrayBuffer()),
		// );

		return {
			success: true,
		};
	},
} satisfies Actions;
