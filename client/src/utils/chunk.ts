const CHUNK_SIZE = 25 * 1024 * 1024 // 25MB

export function splitFileIntoChunks(file: File) {
    const chunks = []
    let currentPosition = 0

    while (currentPosition < file.size) {
        const chunk = file.slice(currentPosition, currentPosition + CHUNK_SIZE)
        chunks.push(chunk)
        currentPosition += CHUNK_SIZE
    }

    return chunks
}
