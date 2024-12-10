<script lang="ts">
  import { clientApi, queryClient } from "$lib/api";
  import { createQuery } from "@tanstack/svelte-query";
  import { Check, CheckCircle } from "lucide-svelte";
  import Preview from "./Preview.svelte";

  let selectedAsset = $state<any>(null);
  let selectedAssets = $state<number[]>([]);
  let lastSelectedIndex = $state<number>(-1);

  const assets = createQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const response = await clientApi.get("/api/assets");
      return response.data.assets;
    },
  });

  async function deleteSelectedAssets() {
    try {
      await clientApi.delete("/api/assets", {
        data: { ids: selectedAssets },
      });
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
      selectedAssets = [];
    } catch (error) {
      console.error("Failed to delete assets:", error);
    }
  }

  function toggleSelect(assetId: string, index: number, event: MouseEvent) {
    event.stopPropagation();
    if (event.shiftKey && lastSelectedIndex >= 0) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const assetsInRange = $assets.data.slice(start, end + 1).map((a) => a.id);

      const allSelected = assetsInRange.every((id) =>
        selectedAssets.includes(id),
      );
      if (allSelected) {
        selectedAssets = selectedAssets.filter(
          (id) => !assetsInRange.includes(id),
        );
      } else {
        selectedAssets = [...new Set([...selectedAssets, ...assetsInRange])];
      }
    } else {
      if (selectedAssets.includes(assetId)) {
        selectedAssets = selectedAssets.filter((id) => id !== assetId);
      } else {
        selectedAssets = [...selectedAssets, assetId];
      }
    }
    lastSelectedIndex = index;
  }

  function openPreview(asset: any) {
    selectedAsset = asset;
  }

  function selectAll() {
    selectedAssets = $assets.data.map((asset) => asset.id);
  }

  function deselectAll() {
    selectedAssets = [];
  }
</script>

<div>
  {#if $assets.isSuccess && $assets.data.length > 0}
    <div class="flex items-center gap-2 mb-4">
      <button class="btn btn-sm" onclick={selectAll}>Select All</button>
      {#if selectedAssets.length > 0}
        <button class="btn btn-sm btn-ghost" onclick={deselectAll}
          >Deselect All</button
        >
        <span class="text-sm opacity-70">
          {selectedAssets.length} of {$assets.data.length} selected
        </span>
        <button class="btn btn-sm btn-error" onclick={deleteSelectedAssets}
          >Delete</button
        >
      {/if}
    </div>

    <div class="flex flex-wrap gap-2">
      {#each $assets.data as asset, index}
        <div class="card bg-base-100 w-96 shadow-lg relative group">
          <figure class="relative h-40">
            <div
              class="bg-cover bg-center w-full h-full"
              style={`${
                asset.assetImageProxies?.[0]?.url
                  ? `background-image: url(${asset.assetImageProxies?.[0]?.url})`
                  : "background-color: black"
              }`}
            >
              {#if asset.status !== "READY"}
                <div
                  class="flex flex-col justify-center items-center w-full h-full bg-black/50"
                >
                  <span class="text-white"
                    >{asset.status === "UPLOADING"
                      ? "Uploading..."
                      : "Processing..."}</span
                  >
                  <progress
                    class="progress progress-info w-56 bg-neutral h-3 rounded-sm"
                    value={asset?.assetVideoProxies?.[0]?.progress}
                    max="100"
                  ></progress>
                </div>
              {:else}
                <div
                  class="flex flex-col w-full h-full group-hover:bg-black/50 transition-background duration-200"
                  role="button"
                  tabindex="0"
                  onclick={() => openPreview(asset)}
                  onkeydown={(e) => e.key === "Enter" && openPreview(asset)}
                >
                  <div class="flex justify-end p-2 w-full">
                    <button
                      class={`rounded-md p-1 ${
                        selectedAssets.includes(asset.id)
                          ? "bg-primary text-neutral"
                          : "bg-neutral text-neutral-content"
                      }`}
                      onclick={(e) => toggleSelect(asset.id, index, e)}
                    >
                      <Check strokeWidth="4" class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          </figure>

          <div class="card-body p-4">
            <h2 class="card-title text-sm">{asset.title}</h2>
            <div class="card-actions justify-end">
              <span class="text-xs opacity-70"
                >{(asset.size / 1024 / 1024).toFixed(1)} MB</span
              >
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if selectedAsset}
  <Preview asset={selectedAsset} onClose={() => (selectedAsset = null)} />
{/if}
