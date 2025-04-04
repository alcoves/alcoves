<script lang="ts">
  import { deserialize } from "$app/forms";
  import type { ActionResult } from "@sveltejs/kit";
  import { UploadIcon } from "lucide-svelte";

  interface Upload {
    file: File;
    id: string;
    progress: number;
    status: "queued" | "uploading" | "completed" | "failed";
  }

  // Only allow images
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const authorizedMimeTypes = ["image/*"];

  let modalOpen = $state(false);
  let files: FileList | undefined = $state();
  let uploads = $state<Upload[]>([]);

  import.meta?.hot?.dispose(() => {
    console.log("hot reload detected, clearing uploads");
    uploads = [];
    files = undefined;
    modalOpen = false;
  });

  function validateFile(file: File): { valid: boolean; error: string } {
    if (
      !authorizedMimeTypes.some((type) =>
        type.endsWith("/*")
          ? file.type.startsWith(type.slice(0, -2))
          : file.type === type
      )
    ) {
      return { valid: false, error: "Only images are supported" };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: "File too large (max 10MB)" };
    }
    return { valid: true, error: "" };
  }

  function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async function uploadFile(upload: Upload) {
    const formData = new FormData();
    formData.append("file", upload.file);
    formData.append("filename", upload.file.name);
    formData.append("type", upload.file.type);

    function updateUpload(updates: Partial<Upload>) {
      const idx = uploads.findIndex((u) => u.id === upload.id);
      if (idx !== -1) {
        Object.assign(uploads[idx], updates);
      }
    }

    try {
      updateUpload({ status: "uploading" });

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "?/upload", true);

      xhr.upload.onprogress = (e) => {
        if (e.total && e.loaded) {
          const progress = Math.round((e.loaded * 100) / e.total);
          updateUpload({ progress });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          updateUpload({ progress: 100, status: "completed" });

          // Remove completed upload after a delay
          setTimeout(() => {
            const idx = uploads.findIndex((u) => u.id === upload.id);
            if (idx !== -1) {
              uploads.splice(idx, 1);
            }
          }, 2000);
        } else {
          updateUpload({ status: "failed" });
        }
      };

      xhr.onerror = () => {
        updateUpload({ status: "failed" });
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Upload error:", error);
      updateUpload({ status: "failed" });
    }
  }

  $effect(() => {
    if (files?.length) {
      for (const file of files) {
        const { valid, error } = validateFile(file);
        if (!valid) {
          console.error(`${file.name}: ${error}`);
          continue;
        }

        const upload: Upload = {
          file,
          progress: 0,
          status: "queued",
          id: generateId(),
        };
        uploads.push(upload);
        uploadFile(upload);
      }

      files = undefined;
      modalOpen = true;
    }

    if (!files?.length && !uploads.length) modalOpen = false;
  });

  function beforeunload(e: BeforeUnloadEvent) {
    const hasActiveUploads = uploads.some(
      ({ status }) => status === "queued" || status === "uploading"
    );

    if (hasActiveUploads) {
      e.preventDefault();
      return undefined;
    }
  }
</script>

<svelte:window onbeforeunload={beforeunload} />

<div class="flex flex-col gap-4">
  <div>
    <input
      bind:files
      multiple
      type="file"
      id="uploadInput"
      class="hidden"
      accept={authorizedMimeTypes.join(",")}
    />

    {#if uploads.length}
      <button
        class="btn btn-primary min-w-[140px]"
        onclick={() => (modalOpen = true)}
      >
        <span class="loading loading-ring loading-sm"></span>
        {"Uploading"}
      </button>
    {:else}
      <label for="uploadInput" class="btn btn-primary min-w-[140px]">
        <UploadIcon size="1.2rem" />
        {"Upload"}
      </label>
    {/if}
  </div>

  <dialog class="modal" class:modal-open={modalOpen}>
    <div class="modal-box">
      <h3 class="text-lg font-bold">Image Uploader</h3>
      <p class="py-4">
        {`There ${uploads.length === 1 ? "is" : "are"} ${uploads.length} ${uploads.length === 1 ? "file" : "files"} in the upload queue`}
      </p>
      {#if uploads.length}
        <div class="flex flex-col w-full gap-4">
          {#each uploads as upload}
            <div
              class="p-2 flex flex-col w-full rounded-md border-2"
              class:border-primary={upload.status !== "failed"}
              class:border-error={upload.status === "failed"}
            >
              <p class="truncate flex justify-between">
                <span>{upload.file.name}</span>
                <span
                  >{upload.status === "failed"
                    ? "Failed"
                    : `${upload.progress}%`}</span
                >
              </p>
              <progress
                max="100"
                value={upload.progress || 1}
                class="progress w-full"
                class:progress-error={upload.status === "failed"}
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
