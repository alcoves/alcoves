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
	const getTrashed = Boolean(c.req.query("trashed")) || false;

	const assetsQuery = await db.query.assets.findMany({
		with: {
			assetImageProxies: {
				orderBy: (assetImageProxies, { desc }) => [desc(assetImageProxies.size)],
			},
			assetVideoProxies: {
				orderBy: (assetVideoProxies, { desc }) => [desc(assetVideoProxies.status)],
			},
		},
		where: (assets, { eq }) => eq(assets.ownerId, user.id) && eq(assets.trashed, getTrashed),
	});

	if (!assetsQuery) {
		throw new HTTPException(400, { message: "No assets found" });
	}

	const assetsWithUrls = await Promise.all(assetsQuery.map(async (asset) => {
		const signedUrl = await getPresignedUrl({
			bucket: asset.storageBucket,
			key: asset.storageKey,
			expiration: 3600,
		})

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

		const videoProxiesWithUrls = await Promise.all(asset.assetImageProxies.map(async (proxy) => {
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
			url: signedUrl,
			assetVideoProxies: videoProxiesWithUrls,
			assetImageProxies: imageProxiesWithUrls,
		}
	}));

	return c.json({ assets: assetsWithUrls });
});

router.get('/:assetId/main.m3u8', async (c) => {
	const { user } = c.get("authorization");
	const { assetId } = c.req.param();
	const asset = await db.query.assets.findFirst({
		with: {
			assetVideoProxies: {
				orderBy: (assetVideoProxies, { desc }) => [desc(assetVideoProxies.status)],
			},
		},
		where: (assets, { eq }) => eq(assets.id, parseInt(assetId)) && eq(assets.ownerId, user.id) && eq(assets.trashed, false),
	});

	if (!asset) {
		throw new HTTPException(404, { message: "Asset not found" });
	}

	const mainProxy = asset.assetVideoProxies.find((proxy) => proxy.type === "HLS");

	if (!mainProxy) {
		throw new HTTPException(404, { message: "Asset not processed" });
	}

	const { Body } = await getObjectFromS3({
		bucket: mainProxy.storageBucket,
		key: mainProxy.storageKey,
	})

	const parsedManifest = await Body?.transformToString()

	const manifestWithApiUrls = parsedManifest?.split("\n").map((line) => {
		if (line.includes('.m3u8')) {
			return `http://localhost:3000/assets/${assetId}/${line}`
		}

		return line
	})

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
		.set({ trashed: true })
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