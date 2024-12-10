<script lang="ts">
  import { isHLSProvider } from "vidstack";
  import "vidstack/bundle";

  const modalId = "preview-player";
  export let asset: any;
  export let onClose: () => void;
  let modalOpen = true;

  $: if (!modalOpen) {
    onClose();
  }
</script>

<input
  id={modalId}
  type="checkbox"
  class="modal-toggle"
  bind:checked={modalOpen}
/>
<div class="modal" role="dialog">
  <div class="fixed inset-0 w-screen h-screen">
    <div class="flex w-full justify-end items-center p-4">
      <label
        for={modalId}
        class="btn btn-sm btn-circle text-white bg-primary"
        on:click={onClose}
      >
        X
      </label>
    </div>

    <div
      class="flex flex-col items-center justify-center w-full h-full max-h-[70vh] gap-4"
    >
      <div class="w-full max-w-[calc(60vh*16/9)] aspect-video p-2">
        <h3 class="text-lg font-bold text-white self-start pb-2">
          {asset.title}
        </h3>
        <media-player
          on:provider-change={({ detail }) => {
            if (isHLSProvider(detail)) {
              detail.config = {
                xhrSetup(xhr) {
                  xhr.withCredentials = true;
                },
              };
            }
          }}
          autoPlay
          playsInline
          volume={0.5}
          title={asset?.title}
          crossorigin="use-credentials"
          src={`http://localhost:3000/api/assets/${asset.id}/manifest/main.m3u8`}
        >
          <media-provider></media-provider>
          <media-video-layout></media-video-layout>
        </media-player>
      </div>
    </div>
  </div>
  <label class="modal-backdrop bg-black/80" for={modalId}>Close</label>
</div>
