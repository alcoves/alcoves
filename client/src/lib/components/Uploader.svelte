<script lang="ts">
  import pLimit from "p-limit";
  import { v4 as uuidV4 } from "uuid";
  import { UploadIcon } from "lucide-svelte";
  import { PUBLIC_ALCOVES_API_URL } from "$env/static/public";
  import { clientApi, queryClient } from "$lib/api";

  interface Upload {
    file: File;
    progress: number;
    totalParts: number;
    id: string;
    urlProgress: {
      [key: string]: number;
    };
    status: "queued" | "uploading" | "completed" | "failed";
  }

  function getChunkSize(totalSize: number): number {
    const _25mb = 25 * 1024 * 1024;
    const _50mb = 50 * 1024 * 1024;
    const _100mb = 100 * 1024 * 1024;
    const _250mb = 250 * 1024 * 1024;
    const _500mb = 500 * 1024 * 1024;
    const _3gb = 3000 * 1024 * 1024;
    const _10gb = 10000 * 1024 * 1024;

    const DEFAULT_CHUNK_SIZE = _25mb;

    if (totalSize <= DEFAULT_CHUNK_SIZE) {
      return DEFAULT_CHUNK_SIZE;
    } else if (totalSize <= _500mb) {
      return _50mb;
    } else if (totalSize <= _3gb) {
      return _100mb;
    } else if (totalSize <= _10gb) {
      return _250mb;
    } else {
      return _500mb;
    }
  }

  const uploadLimiter = pLimit(4);
  let modalOpen = $state(false);
  let files: FileList | undefined = $state();
  let uploads = $state<Record<string, Upload>>({});

  async function initiateMultipartUpload(file: File) {
    const response = await clientApi.post(
      `${PUBLIC_ALCOVES_API_URL}/api/uploads`,
      {
        filename: file.name,
        contentType: file.type,
        parts: Math.ceil(file.size / getChunkSize(file.size)),
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  }

  function recalculateTotalProgress(upload: Upload) {
    const totalProgress = Object.values(upload.urlProgress).reduce(
      (a, b) => a + b,
      0,
    );
    upload.progress = Math.round(totalProgress / upload.totalParts);
  }

  async function uploadPart(url: string, chunk: Blob, upload: Upload) {
    const response = await clientApi.put(url, chunk, {
      headers: { "Content-Type": "application/octet-stream" },
      onUploadProgress: (e) => {
        if (!e.total || !e.loaded) return;
        const progress = Math.round((e.loaded * 100) / e.total);
        upload.urlProgress[url] = progress;
        recalculateTotalProgress(upload);
      },
    });
    return response.headers["etag"];
  }

  async function completeMultipartUpload({
    key,
    uploadId,
    parts,
    name,
    size,
    mimeType,
  }: {
    name: string;
    size: number;
    mimeType: string;
    key: string;
    uploadId: string;
    parts: { ETag: string; PartNumber: number }[];
  }) {
    const response = await clientApi.post(
      `${PUBLIC_ALCOVES_API_URL}/api/uploads/complete`,
      { key, uploadId, parts, name, size, mimeType },
    );
    return response.data;
  }

  async function startUpload(upload: Upload) {
    try {
      upload.urlProgress = {};
      upload.status = "uploading";
      const file = upload.file;
      const chunks: Blob[] = [];

      console.info("Splitting file into chunks", getChunkSize(file.size));
      for (let start = 0; start < file.size; start += getChunkSize(file.size)) {
        const chunk = file.slice(start, start + getChunkSize(file.size));
        chunks.push(chunk);
      }

      upload.totalParts = chunks.length;
      console.info("File split into chunks", chunks);
      const {
        payload: { uploadId, key, parts },
      } = await initiateMultipartUpload(file);

      const uploadPromises = chunks.map((chunk, index) =>
        uploadLimiter(async () => {
          const { signedUrl, partNumber } = parts[index];
          const etag = await uploadPart(signedUrl, chunk, upload);
          if (!etag) {
            throw new Error("ETag is null");
          }
          return { ETag: etag, PartNumber: partNumber };
        }),
      );
      console.info("Multipart upload initiated", uploadId, key, parts);
      const completedParts = await Promise.all(uploadPromises);
      recalculateTotalProgress(upload);

      console.info("All parts uploaded", completedParts);
      await completeMultipartUpload({
        key,
        uploadId,
        parts: completedParts,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      });

      upload.progress = 100;
      upload.status = "completed";
      delete uploads[upload.id];
      console.info("Upload Succeeded");
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
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
    accept="image/png, image/jpeg, video/mp4"
  />

  {#if Object.keys(uploads).length}
    <button
      class="btn btn-primary min-w-[140px]"
      onclick={() => (modalOpen = true)}
    >
      <span class="loading loading-spinner"></span>
      {"Uploading"}
    </button>
  {:else}
    <button
      class="btn btn-primary min-w-[140px]"
      onclick={() => document.getElementById("uploadInput")?.click()}
    >
      <UploadIcon size="1.2rem" />
      {"Upload"}
    </button>
  {/if}

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
