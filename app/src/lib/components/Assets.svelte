<script lang="ts">
  import Preview from "./Preview.svelte";
  import AssetCard from "./AssetCard.svelte";
  import { createEventDispatcher } from "svelte";

  export let assets: any[] = [];

  const dispatch = createEventDispatcher();

  let selectedAssets: string[] = [];
  let selectedAsset: any = null;

  function selectAll() {
    selectedAssets = assets.map((asset) => asset.id);
  }

  function deselectAll() {
    selectedAssets = [];
  }

  function handleSelect({ detail }: CustomEvent<{ id: string }>) {
    const id = detail.id;
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
    dispatch("deleteAssets", { assetIds: selectedAssets });
    assets = assets.filter((asset) => !selectedAssets.includes(asset.id));
    selectedAssets = [];
  }

  function handlePreview({ detail }: CustomEvent<{ asset: any }>) {
    selectedAsset = detail.asset;
  }

  function closePreview() {
    selectedAsset = null;
  }
</script>

<div>
  {#if assets.length > 0}
    <div class="flex items-center gap-2 mb-4">
      <button class="btn btn-sm" on:click={selectAll}>Select All</button>
      {#if selectedAssets.length > 0}
        <button class="btn btn-sm btn-ghost" on:click={deselectAll}
          >Deselect All</button
        >
        <span class="text-sm opacity-70">
          {selectedAssets.length} of {assets.length} selected
        </span>
        <button class="btn btn-sm btn-error" on:click={deleteSelectedAssets}>
          Delete
        </button>
      {/if}
    </div>

    <div class="flex flex-wrap gap-2">
      {#each assets as asset (asset.id)}
        <AssetCard
          {asset}
          isSelected={selectedAssets.includes(asset.id)}
          on:select={handleSelect}
          on:preview={handlePreview}
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
