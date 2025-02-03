<script lang="ts">
  import Preview from "./Preview.svelte";
  import { Check } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  export let assets: any[] = [];

  const dispatch = createEventDispatcher();

  let selectedAssets: string[] = [];
  let selectedAsset: any = null;

  function formatDuration(seconds: number): string {
    const sec = typeof seconds === "string" ? parseFloat(seconds) : seconds;
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const remainingSeconds = Math.floor(sec % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function selectAll() {
    selectedAssets = assets.map((asset) => asset.id);
  }

  function deselectAll() {
    selectedAssets = [];
  }

  function toggleSelect(id: string, event: MouseEvent) {
    event.stopPropagation();
    if (selectedAssets.includes(id)) {
      selectedAssets = selectedAssets.filter((assetId) => assetId !== id);
    } else {
      selectedAssets = [...selectedAssets, id];
    }
  }

  function deleteSelectedAssets() {
    const confirmDeletion = confirm(
      "Are you sure you want to delete the selected assets?",
    );
    if (!confirmDeletion) return;
    // Emit deletion event so parent can handle deletion
    dispatch("deleteAssets", { assetIds: selectedAssets });
    // For local demo, remove assets from view
    assets = assets.filter((asset) => !selectedAssets.includes(asset.id));
    selectedAssets = [];
  }

  function openPreview(asset: any) {
    selectedAsset = asset;
  }

  function closePreview() {
    selectedAsset = null;
  }
</script>

<div>
  {#if assets.length > 0}
    <div class="flex items-center gap-2 mb-4">
      <button class="btn btn-sm" onclick={selectAll}>Select All</button>
      {#if selectedAssets.length > 0}
        <button class="btn btn-sm btn-ghost" onclick={deselectAll}
          >Deselect All</button
        >
        <span class="text-sm opacity-70">
          {selectedAssets.length} of {assets.length} selected
        </span>
        <button class="btn btn-sm btn-error" onclick={deleteSelectedAssets}>
          Delete
        </button>
      {/if}
    </div>

    <div class="flex flex-wrap gap-2">
      {#each assets as asset, index}
        <div
          role="button"
          tabindex="0"
          class="card bg-base-200 w-full md:w-96 shadow-md {selectedAssets.includes(
            asset?.id,
          )
            ? 'border border-primary'
            : 'border border-base-300'}"
          onclick={() => openPreview(asset)}
          onkeydown={(e) => e.key === "Enter" && openPreview(asset)}
        >
          <figure class="relative h-40 w-full group">
            {#if asset?.status !== "READY"}
              {#if asset?.thumbnails?.[0]?.url}
                <img
                  alt={asset?.title}
                  src={asset?.thumbnails?.[0]?.url}
                  class="absolute object-cover w-full h-full"
                />
              {:else}
                <div class="absolute object-cover w-full h-full bg-black"></div>
              {/if}
              <div
                class="flex flex-col w-full h-full justify-center items-center bg-black/50 z-10"
              >
                <span class="text-white">
                  {asset?.status === "UPLOADING"
                    ? "Uploading..."
                    : "Processing..."}
                </span>
                <progress
                  class="progress progress-info w-56 bg-neutral h-3 rounded-sm"
                  value={asset?.proxies?.[0]?.progress || 0}
                  max="100"
                ></progress>
              </div>
            {:else}
              {#if asset?.thumbnails?.[0]?.url}
                <img
                  alt={asset?.title}
                  src={asset?.thumbnails?.[0]?.url}
                  class="absolute object-cover w-full h-full"
                />
                {#if asset?.metadata?.format?.duration}
                  <div
                    class="absolute bottom-1 right-1 bg-black/75 px-2 py-0.5 rounded font-semibold text-xs text-white z-20"
                  >
                    {formatDuration(asset.metadata.format.duration)}
                  </div>
                {/if}
              {:else}
                <div class="absolute object-cover w-full h-full bg-black"></div>
              {/if}
              <div
                class="flex flex-col w-full h-full group-hover:bg-black/50 transition duration-200 z-10"
                role="button"
                tabindex="0"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                  }
                }}
              >
                <div class="flex w-full justify-end p-2">
                  <button
                    type="button"
                    class="rounded-md p-1"
                    class:selected={selectedAssets.includes(asset?.id)}
                    onclick={(e) => toggleSelect(asset?.id, e)}
                  >
                    <Check strokeWidth="4" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            {/if}
          </figure>

          <div class="card-body p-4">
            <h2 class="card-title text-sm">{asset?.title}</h2>
            <div class="card-actions justify-end">
              <span class="text-xs opacity-70">
                {(asset?.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>No assets found.</p>
  {/if}
</div>

{#if selectedAsset}
  <Preview asset={selectedAsset} on:close={closePreview} />
{/if}
