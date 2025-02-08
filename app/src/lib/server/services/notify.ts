
import createSubscriber from "pg-listen"
import type { Asset } from "../db/schema"
import { getAsset } from "./assets";

export interface AssetNotification {
  type: "ASSET_CREATED" | "ASSET_UPDATED" | "ASSET_DELETED";
  asset: Asset;
  time: number;
}

export const subscriber = createSubscriber({ 
  connectionString: process.env.ALCOVES_DB_CONNECTION_STRING!,
})

subscriber.events.on("error", (error) => {
  console.error("Fatal database connection error:", error)
})

let isConnected = false

export async function ensureConnection() {
  if (!isConnected) {
    await subscriber.connect()
    isConnected = true
    console.log('Successfully connected to PostgreSQL')
  }
}

export async function getNotifySubscriber() {
  await ensureConnection()
  return subscriber
}

export async function notifyAssetCreate(channelId: string) {
  const subscriber = await getNotifySubscriber()
  const payload = { type: "ASSET_CREATED", time: Date.now() } as AssetNotification;
  await subscriber.notify(channelId, JSON.stringify(payload));
}

export async function notifyAsset(assetId: string, type: AssetNotification["type"]) {
  const asset = await getAsset(assetId);
  if (!asset) return
  delete asset.metadata; // Because it is huge
  const payload = { type, asset, time: Date.now() } as AssetNotification;
  const subscriber = await getNotifySubscriber();
  await subscriber.notify("assets", JSON.stringify(payload));
}