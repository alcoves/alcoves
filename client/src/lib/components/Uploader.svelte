<script lang="ts">
  import { v4 as uuidV4 } from "uuid";
  import { UploadIcon } from "lucide-svelte";

  interface Upload {
    file: File;
    progress: number;
    id: string;
    status: "queued" | "uploading" | "completed" | "failed";
  }

  let uploads = $state<Record<string, Upload>>({});
  let files: FileList | undefined = $state();
  let modalOpen = $state(false);

  async function startUpload(upload: Upload) {
    try {
      upload.status = "uploading";

      setTimeout(() => {
        // I'm really surprised that this works. We don't need to reassign the upload object?
        // Svelte is smart enough to know that the object has changed? 🤯
        upload.progress = 100;
        upload.status = "completed";

        delete uploads[upload.id];
      }, 2000);
    } catch (error) {
      console.error("Upload Error:", error);
      upload.status = "failed";
    }
  }

  $effect(() => {
    if (files?.length) {
      let selectedFilesAddition = {};
      console.info("Some files were selected for uploading", files);

      for (const file of files) {
        const uniqueId = uuidV4();
        const addition = {
          [uniqueId]: {
            file,
            progress: 0,
            id: uniqueId,
            status: "queued",
          },
        };
        selectedFilesAddition = { ...selectedFilesAddition, ...addition };
      }

      uploads = { ...uploads, ...selectedFilesAddition };
      files = undefined;
      modalOpen = true;
    }

    const isOneUploading = Object.values(uploads).some(
      (upload) => upload.status === "uploading",
    );

    if (!isOneUploading) {
      const selectedUploadToStart = Object.values(uploads).find(
        (upload) => upload.status === "queued",
      );
      if (selectedUploadToStart) startUpload(selectedUploadToStart);
    }
  });

  function beforeunload(e: BeforeUnloadEvent) {
    const hasActiveUploads = Object.values(uploads).some(
      (upload) => upload.status === "queued" || upload.status === "uploading",
    );

    if (hasActiveUploads) {
      // Modern approach - just show default browser message
      e.preventDefault();
      // Return undefined to let browser handle the confirmation dialog
      return undefined;
    }
  }
</script>

<svelte:window onbeforeunload={beforeunload} />

<div class="flex flex-col gap-4">
  <input
    bind:files
    multiple
    type="file"
    id="uploadInput"
    class="hidden"
    accept="image/png, image/jpeg"
  />

  <button
    class="btn btn-primary"
    onclick={() =>
      Object.keys(uploads).length
        ? (modalOpen = true)
        : document.getElementById("uploadInput")?.click()}
  >
    <UploadIcon size="1.2rem" />
    {Object.keys(uploads).length ? "Uploading" : "Upload"}
  </button>

  <dialog class="modal" class:modal-open={modalOpen}>
    <div class="modal-box">
      <h3 class="text-lg font-bold">Uploader</h3>
      <p class="py-4">
        {`There are ${Object.keys(uploads).length} files in the upload queue`}
      </p>
      {#if Object.keys(uploads).length}
        <div class="flex flex-col w-full gap-4">
          {#each Object.values(uploads) as upload}
            <div
              class="p-2 flex flex-col w-full rounded-md border-2 border-primary"
            >
              <p class="truncate">
                {upload.file.name} - {upload.progress} - {upload.status}
              </p>
              <progress
                max="100"
                value={upload.progress || 1}
                class="progress w-full"
              ></progress>
            </div>
          {/each}
        </div>
      {/if}
      <div class="modal-action">
        <button class="btn" onclick={() => (modalOpen = false)}>Close</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button onclick={() => (modalOpen = false)}>Close</button>
    </form>
  </dialog>
</div>
