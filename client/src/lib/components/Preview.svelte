<script lang="ts">
  import "vidstack/bundle";
  // import { browser } from "$app/environment";

  export let asset: any;
  export let onClose: () => void;

  // // We disable server rendering because vidstack must be loaded in the browser in order to get the proper credentials
  // export const prerender = false;
</script>

<dialog class="modal modal-open">
  <div class="fixed inset-0 bg-black">
    <div
      class="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10"
    >
      <h3 class="text-lg font-bold text-white">{asset.title}</h3>
      <button class="btn btn-sm btn-circle text-white" on:click={onClose}
        >✕</button
      >
    </div>

    <div class="h-screen w-screen flex items-center justify-center">
      <media-player
        playsInline
        title={asset?.title}
        crossorigin="use-credentials"
        src={`http://localhost:3000/api/assets/${asset.id}/main.m3u8`}
      >
        <media-provider></media-provider>
        <media-video-layout></media-video-layout>
      </media-player>

      <!-- <img
        src={asset?.url}
        alt={asset.title}
        class="max-h-[100vh] max-w-[100vw] object-contain"
      /> -->
    </div>
  </div>
</dialog>

<!-- Instead, we could proxy this request to the sveltekit backened where we know cookies will work -->
