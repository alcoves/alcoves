<script lang="ts">
  import { Check } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  export let asset: any;
  export let isSelected: boolean = false;

  const dispatch = createEventDispatcher();

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

  function handleSelect(event: MouseEvent) {
    event.stopPropagation();
    dispatch("select", { id: asset.id });
  }

  function handleClick() {
    dispatch("preview", { asset });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleClick();
    }
  }
</script>

<div
  role="button"
  tabindex="0"
  class="card bg-base-200 w-full md:w-96 shadow-md {isSelected
    ? 'border border-primary'
    : 'border border-base-300'}"
  on:click={handleClick}
  on:keydown={handleKeydown}
>
  <figure class="relative h-40 w-full group">
    {#if asset?.status !== "READY"}
      {#if asset?.thumbnail?.url}
        <img
          alt={asset?.title}
          src={asset.thumbnail.url}
          class="absolute object-cover w-full h-full"
        />
      {:else}
        <div class="absolute object-cover w-full h-full bg-black"></div>
      {/if}
      <div
        class="flex flex-col w-full h-full justify-center items-center bg-black/50 z-10"
      >
        <span class="text-white">
          {asset?.status === "UPLOADING" ? "Uploading..." : "Processing..."}
        </span>
        <progress
          class="progress progress-info w-56 bg-neutral h-3 rounded-sm"
          value={asset?.proxies?.[0]?.progress || 0}
          max="100"
        ></progress>
      </div>
    {:else}
      {#if asset?.thumbnail?.url}
        <img
          alt={asset?.title}
          src={asset.thumbnail.url}
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
        on:click={(e) => e.stopPropagation()}
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
      >
        <div class="flex w-full justify-end p-2">
          <button
            type="button"
            class="rounded-md p-1"
            class:selected={isSelected}
            on:click={handleSelect}
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
