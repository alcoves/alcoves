<script lang="ts">
  import { clientApi, queryClient } from "$lib/api";
  import { createQuery } from "@tanstack/svelte-query";
  import { CheckCircle } from "lucide-svelte";
  import Preview from "$lib/components/Preview.svelte";

  let selectedAsset = $state<any>(null);
  let selectedAssets = $state<number[]>([]);
  let lastSelectedIndex = $state<number>(-1);

  const assets = createQuery({
    queryKey: ["assets", "trashed"],
    queryFn: async () => {
      const response = await clientApi.get("/api/assets?trashed=true");
      return response.data.assets;
    },
  });

  async function restoreSelectedAssets() {
    try {
      await clientApi.post("/api/assets/restore", {
        data: { ids: selectedAssets },
      });
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
      selectedAssets = [];
    } catch (error) {
      console.error("Failed to restore assets:", error);
    }
  }

  async function permanentlyDeleteSelectedAssets() {
    try {
      await clientApi.delete("/api/assets/permanent", {
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
      <button class="btn btn-sm" on:click={selectAll}>Select All</button>
      {#if selectedAssets.length > 0}
        <button class="btn btn-sm btn-ghost" on:click={deselectAll}>
          Deselect All
        </button>
        <span class="text-sm opacity-70">
          {selectedAssets.length} of {$assets.data.length} selected
        </span>
        <button class="btn btn-sm btn-success" on:click={restoreSelectedAssets}>
          Restore
        </button>
        <button
          class="btn btn-sm btn-error"
          on:click={permanentlyDeleteSelectedAssets}
        >
          Delete Permanently
        </button>
      {/if}
    </div>

    <div class="flex flex-wrap gap-2">
      {#each $assets.data as asset, index}
        <div class="relative group">
          <div
            class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
            role="button"
            tabindex="0"
            on:click={() => openPreview(asset)}
            on:keydown={(e) => e.key === "Enter" && openPreview(asset)}
          >
            <button
              class="absolute top-2 right-2"
              on:click={(e) => toggleSelect(asset.id, index, e)}
            >
              <CheckCircle
                size={24}
                class={selectedAssets.includes(asset.id)
                  ? "text-primary"
                  : "text-white"}
              />
            </button>
          </div>
          <img
            src={asset?.assetImageProxies?.[0]?.url || asset.url}
            alt={asset.title}
            class={`object-scale-down rounded-md max-h-48 max-w-96 ${selectedAssets.includes(asset.id) ? "ring-2 ring-primary" : ""}`}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if selectedAsset}
  <Preview asset={selectedAsset} onClose={() => (selectedAsset = null)} />
{/if}
