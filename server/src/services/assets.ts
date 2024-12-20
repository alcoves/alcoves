import { db } from "../db/db";
import { getPresignedUrl } from "../lib/s3";

export async function getAsset(id: string): Promise<any|null> {
  const asset = await db.query.assets.findFirst({
      orderBy: (assets, { desc }) => [desc(assets.createdAt)],
      with: {
        assetImageProxies: {
          orderBy: (assetImageProxies, { desc }) => [desc(assetImageProxies.size)],
        },
        assetVideoProxies: {
          orderBy: (assetVideoProxies, { desc }) => [desc(assetVideoProxies.status)],
        },
      },
    });
  
  if (!asset) return null
  const updatedAsset = await assetsWithUrls([asset]);
  return updatedAsset[0];
}

export function assetsWithUrls(a: any[]): Promise<any[]> {
  return Promise.all(a.map(async (asset) => {
    if (asset?.assetImageProxies?.length) {
      const imageProxiesWithUrls = await Promise.all(asset?.assetImageProxies.map(async (proxy: any) => {
        if (proxy?.storageBucket && proxy?.storageKey) {
          const signedProxyUrl = await getPresignedUrl({
            bucket: proxy.storageBucket,
            key: proxy.storageKey,
            expiration: 3600,
          });

          return {
            ...proxy,
            url: signedProxyUrl,
          }
        }

        return proxy
      }))

      return {
        ...asset,
        assetImageProxies: imageProxiesWithUrls,
      }
    }
    return asset
  }));
}