import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AssetJob } from "../workers/assets";
import { db } from "$lib/server/db/db";
import { eq } from "drizzle-orm";
import { assets } from "$lib/server/db/schema";
import { getMediaInfo } from "$lib/server/utilities/ffmpeg";
import { getPresignedUrl } from "$lib/server/utilities/s3";

export async function ingestAsset(job: AssetJob): Promise<void> {
  const tmpDir = await mkdtemp(join(tmpdir(), "alcoves-"));
  console.info(`Created temporary directory: ${tmpDir}`);

  try {
    console.info("Processing asset ingestion job");
    const [asset] = await db.select().from(assets).where(eq(assets.id, job.data.assetId));
    if (!asset) throw new Error(`Asset not found: ${job.data.assetId}`);

    console.info("Fetching asset metadata")
    if (asset.type === "VIDEO") {
      const sourceMediaUrl = await getPresignedUrl({
        key: asset.storageKey,
        bucket: asset.storageBucket,
      })
      const metadata = await getMediaInfo(sourceMediaUrl)
      console.log("Metadata", metadata);
    } else if (asset.type === "IMAGE") {
      throw new Error("Image processing not implemented");
    } else {
      throw new Error("Invalid asset type");
    }
  } catch(error) {
    console.error("Error", error);
    // Do not rethrow, this is the last place to catch errors
  } finally {
    console.info("Removing temporary directory");
    await rm(tmpDir, { recursive: true, force: true });
  }
}