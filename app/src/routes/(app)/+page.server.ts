import { type Actions, fail } from "@sveltejs/kit";

export const actions = {
	upload: async ({ request }) => {
		console.log("Uploading File!");
		const formData = Object.fromEntries(await request.formData());

		if (
			!(formData.fileToUpload as File).name ||
			(formData.fileToUpload as File).name === "undefined"
		) {
			return fail(400, {
				error: true,
				message: "You must provide a file to upload",
			});
		}

		const { fileToUpload } = formData as { fileToUpload: File };

		// // Write the file to the static folder
		// writeFileSync(
		// 	`static/${fileToUpload.name}`,
		// 	Buffer.from(await fileToUpload.arrayBuffer()),
		// );

		return {
			success: true,
		};
	},
} satisfies Actions;
