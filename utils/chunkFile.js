const DEFAULT_CHUNK_SIZE = 10000000 * 2 // 20mb

export default function chunkFile(file, chunkSize = DEFAULT_CHUNK_SIZE) {
  let end
  let blob
  let start

  const parts = []
  const fileSize = file.size
  const NUM_CHUNKS = Math.floor(fileSize / chunkSize) + 1

  for (let index = 1; index < NUM_CHUNKS + 1; index++) {
    start = (index - 1) * chunkSize
    end = index * chunkSize
    blob = index < NUM_CHUNKS ? file.slice(start, end) : file.slice(start)
    parts.push(blob)
  }

  return parts
}
