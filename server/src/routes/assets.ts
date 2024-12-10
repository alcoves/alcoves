import { Hono } from "hono";
import { db } from "../db/db";
import { userAuth, UserAuthMiddleware } from "../middleware/auth";
import { HTTPException } from "hono/http-exception";
import { getObjectFromS3, getPresignedUrl } from "../lib/s3";
import { imageProcessingQueue, ImageTasks } from "../tasks/queues";
import { ImageProxyJobData } from "../tasks/tasks/images";
import { assets } from "../db/schema";
import { and, eq, inArray } from "drizzle-orm";

const router = new Hono<{ Variables: UserAuthMiddleware }>();

router.use(userAuth);

// Create a maintenance job which checks assets that are status UPLOADING and see if their storage object exists, mark as UPLOADED if it does
// After the source asset is marked as UPLOADED, a job to optimize the asset should be enqueued

// This route returns all the users assets
router.get("/", async (c) => {
	const { user } = c.get("authorization");
	const getDeleted = Boolean(c.req.query("deleted")) || false;

	const assetsQuery = await db.query.assets.findMany({
		orderBy: (assets, { desc }) => [desc(assets.createdAt)],
		with: {
			assetImageProxies: {
				orderBy: (assetImageProxies, { desc }) => [desc(assetImageProxies.size)],
			},
			assetVideoProxies: {
				orderBy: (assetVideoProxies, { desc }) => [desc(assetVideoProxies.status)],
			},
		},
		where: (assets, { eq }) => eq(assets.ownerId, user.id) && eq(assets.deleted, getDeleted),
	});

	if (!assetsQuery) {
		throw new HTTPException(400, { message: "No assets found" });
	}

	const assetsWithUrls = await Promise.all(assetsQuery.map(async (asset) => {
		const imageProxiesWithUrls = await Promise.all(asset.assetImageProxies.map(async (proxy) => {
			const signedProxyUrl = await getPresignedUrl({
				bucket: proxy.storageBucket,
				key: proxy.storageKey,
				expiration: 3600,
			});

			return {
				...proxy,
				url: signedProxyUrl,
			}
		}))

		return {
			...asset,
			assetImageProxies: imageProxiesWithUrls,
		}
	}));

	return c.json({ assets: assetsWithUrls });
});

router.get('/:assetId/manifest/:manifestName', async (c) => {
	const { user } = c.get("authorization");
	const { assetId, manifestName } = c.req.param();
	const asset = await db.query.assets.findFirst({
		with: {
			assetVideoProxies: {
				orderBy: (assetVideoProxies, { desc }) => [desc(assetVideoProxies.status)],
			},
		},
		where: (assets, { eq, and }) => and(eq(assets.id, assetId), eq(assets.deleted, false))
	});

	if (!asset) {
		throw new HTTPException(404, { message: "Asset not found" });
	}

	if (asset.ownerId !== user.id) {
		// this is where we can do a check based on video visibility
		throw new HTTPException(403, { message: "Forbidden" });
	}

	const mainProxy = asset.assetVideoProxies.find((proxy) => proxy.type === "HLS");

	if (!mainProxy) {
		throw new HTTPException(404, { message: "Asset not processed" });
	}

	let fetchParams = {
		bucket: mainProxy.storageBucket,
		key: mainProxy.storageKey,
	}

	if (manifestName !== 'main.m3u8') {
		fetchParams = {
			bucket: mainProxy.storageBucket,
			key: mainProxy.storageKey.replace('main.m3u8', manifestName),
		}
	}

	const { Body } = await getObjectFromS3(fetchParams).catch((err) => {
		throw new HTTPException(400, { message: "Bad manifest name" });
	})

	const parsedManifest = await Body?.transformToString()

	const manifestWithApiUrls = parsedManifest ? await Promise.all(parsedManifest.split("\n").map(async (line) => {
		// Replaces the .m3u8 file with the API endpoint
		if (line.includes('.m3u8')) {
			return `http://localhost:3000/api/assets/${assetId}/manifest/${line}`
		}

		// #EXT-X-MAP:URI="stream_video_init.mp4"
		if (line.includes('EXT-X-MAP:URI=')) {
			const initFile = line.split('URI=')[1].replace(/"/g, '');

			const signedUrl = await getPresignedUrl({
				bucket: mainProxy.storageBucket,
				key: mainProxy.storageKey.replace('main.m3u8', initFile),
				expiration: 3600,
			})

			return line.replace(initFile, signedUrl)
		}

		// Replaces .m4s files with signed urls
		if (line.includes('.m4s') || line.includes('.mp4')) {
			const signedUrl= await getPresignedUrl({
				bucket: mainProxy.storageBucket,
				key: mainProxy.storageKey.replace('main.m3u8', line),
				expiration: 3600,
			})

			return signedUrl
		}

		return line
	})) : [];

	if (!manifestWithApiUrls) {
		throw new HTTPException(500, { message: "Failed to parse manifest" });
	}

	return c.text(manifestWithApiUrls?.join("\n"));
});


// Delete multiple assets
router.delete("/", async (c) => {
	const { ids } = await c.req.json();
	const { user } = c.get("authorization");

	await db.update(assets)
		.set({ deleted: true })
    .where(
      and(
        eq(assets.ownerId, user.id),
        inArray(assets.id, ids)
      )
    );

	return c.json({ status: "ok" });
});

// Edit an asset
router.patch("/:assetId", (c) => {
	return c.json({ status: "ok" });
});

export const assetsRouter = router;