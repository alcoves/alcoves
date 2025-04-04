import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { getAssetsDirectory } from "$lib/server/utils.js";
import { error } from "@sveltejs/kit";
import sharp from "sharp";

export async function GET({ url, params, request }) {
	const relativePath = url.pathname.replace(/^\/api\/proxy\//, "");
	const filePath = join(await getAssetsDirectory(), relativePath);

	const fileStat = await stat(filePath);

	// if (!fileStat.isFile()) {
	// 	throw error(404, "Not a file");
	// }

	// Get query parameters for resizing if needed
	const width = url.searchParams.get("width")
		? Number.parseInt(url.searchParams.get("width"))
		: null;
	const height = url.searchParams.get("height")
		? Number.parseInt(url.searchParams.get("height"))
		: null;
	const format = url.searchParams.get("format")
		? url.searchParams.get("format")
		: null;

	if (width || height || format) {
		const readStream = createReadStream(filePath);

		const transform = sharp()
			.resize(width, height, {
				fit: "inside",
				withoutEnlargement: true,
			})
			.rotate()
			.toFormat(format || "jpeg", {
				quality: 90,
			});

		const sharpStream = readStream.pipe(transform);
		const contentType = Bun.file(`image.${format || "jpeg"}`).type;

		console.info("Returning optimized image:", filePath);
		return new Response(sharpStream, {
			headers: {
				"Content-Type": contentType,
			},
		});
	}

	// If no resizing is needed, return the file directly
	console.info("Returning original file:", filePath);
	return new Response(Bun.file(filePath), {
		headers: {
			"Content-Type": "image/jpeg",
		},
	});
}
