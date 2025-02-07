<script lang="ts">
  import AssetCard from "./AssetCard.svelte";
  import Preview from "./Preview.svelte";

  let { assets = [], onDeleteAssets } = $props<{
    assets: any[];
    onDeleteAssets?: (assetIds: string[]) => void;
  }>();

  let selectedAssets = $state<string[]>([]);
  let selectedAsset = $state<any>(null);

  function selectAll() {
    selectedAssets = assets.map((asset) => asset.id);
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
    assets = assets.filter((asset) => !selectedAssets.includes(asset.id));
    selectedAssets = [];
  }

  function handlePreview(asset: any) {
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
        <button class="btn btn-sm btn-ghost" onclick={deselectAll}>
          Deselect All
        </button>
        <span class="text-sm opacity-70">
          {selectedAssets.length} of {assets.length} selected
        </span>
        <button class="btn btn-sm btn-error" onclick={deleteSelectedAssets}>
          Delete
        </button>
      {/if}
    </div>

    <div class="flex flex-wrap gap-2">
      {#each assets as asset (asset.id)}
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
