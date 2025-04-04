<script lang="ts">
  console.log("Assets");
  const { assets } = $props();
  console.log("ASSETS", assets);
</script>

{#if assets}
  <div class="assets-container">
    {#each assets as asset}
      <div class="asset-item">
        <h3>{asset.id}</h3>
        <img
          width="400px"
          src={`/api/proxy/${asset.id}/${asset.id}.JPG?width=400`}
          alt={asset.id}
        />
        {#if asset.description}
          <p>{asset.description}</p>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <p>No assets found.</p>
{/if}
