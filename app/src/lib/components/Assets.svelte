<script lang="ts">
  import { source } from "sveltekit-sse";
  import { assets, updateAsset, type Asset } from "../../stores/assets";
  import AssetCard from "./AssetCard.svelte";
  import Preview from "./Preview.svelte";
  import { invalidateAll } from "$app/navigation";

  let { initialAssets, onDeleteAssets } = $props<{
    initialAssets?: Asset[];
    onDeleteAssets?: (assetIds: string[]) => void;
  }>();

  let selectedAssets = $state<string[]>([]);
  let selectedAsset = $state<Asset | null>(null);

  $effect(() => {
    if (initialAssets) {
      assets.set(initialAssets);
    }
  });

  const connection = source(`/api/sse/f4907488-2f77-402e-b4f5-92398ac5b698`, {
    close({ connect }) {
      console.log("SSE connection failed, reconnecting...");
      connect();
    },
  });

  $effect(() => {
    const unsubscribe = connection.select("assets").subscribe((message) => {
      try {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage?.type) {
          case "ASSET_CREATED":
            console.log("ASSET_CREATED");
            invalidateAll();
            break;
          case "ASSET_DELETED":
            console.log("ASSET_DELETED");
            invalidateAll();
            break;
          case "ASSET_UPDATED":
            console.log("ASSET_UPDATED");
            updateAsset(parsedMessage.asset);
            break;
        }
      } catch (error) {
        // Ignore json parse error
      }
    });

    return () => {
      unsubscribe();
      connection.close();
    };
  });

  function selectAll() {
    $assets.forEach((asset) => {
      if (!selectedAssets.includes(asset.id)) {
        selectedAssets = [...selectedAssets, asset.id];
      }
    });
  }

  function deselectAll() {
    selectedAssets = [];
  }

  function handleSelect(id: string) {
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

    onDeleteAssets?.(selectedAssets);
    assets.update((currentAssets) =>
      currentAssets.filter((asset) => !selectedAssets.includes(asset.id)),
    );
    selectedAssets = [];
  }

  function handlePreview(asset: Asset) {
    selectedAsset = asset;
  }

  function closePreview() {
    selectedAsset = null;
  }
</script>

<div>
  {#if $assets.length > 0}
    <div class="flex items-center gap-2 mb-4">
      <button class="btn btn-sm" onclick={selectAll}>Select All</button>
      {#if selectedAssets.length > 0}
        <button class="btn btn-sm btn-ghost" onclick={deselectAll}>
          Deselect All
        </button>
        <span class="text-sm opacity-70">
          {selectedAssets.length} of {$assets.length} selected
        </span>
        <button class="btn btn-sm btn-error" onclick={deleteSelectedAssets}>
          Delete
        </button>
      {/if}
    </div>

    <div class="flex flex-wrap gap-2">
      {#each $assets as asset (asset.id)}
        <AssetCard
          {asset}
          isSelected={selectedAssets.includes(asset.id)}
          onSelect={handleSelect}
          onPreview={handlePreview}
        />
      {/each}
    </div>
  {:else}
    <p>No assets found.</p>
  {/if}
</div>

{#if selectedAsset}
  <Preview asset={selectedAsset} onClose={closePreview} />
{/if}
