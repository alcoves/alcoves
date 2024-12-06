<script lang="ts">
  export let asset: any;
  export let onClose: () => void;
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
      <img
        src={asset?.url}
        alt={asset.title}
        class="max-h-[100vh] max-w-[100vw] object-contain"
      />
    </div>
  </div>
</dialog>
