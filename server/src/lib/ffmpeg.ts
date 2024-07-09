import { spawn } from 'child_process'

/**
 * Runs an FFmpeg command and calculates progress using a promise.
 * @param input The input file path.
 * @param output The output file path.
 * @param commands The FFmpeg commands to run.
 * @param onProgress Callback to receive progress updates as a percentage.
 * @returns A Promise that resolves when FFmpeg process completes.
 */
export function runFFmpeg({
    input,
    output,
    commands,
    onProgress,
}: {
    input: string
    output: string
    commands: string
    onProgress: (progress: number, estimatedTimeRemaining: string) => void
}): Promise<void> {
    return new Promise((resolve, reject) => {
        // Construct the FFmpeg command arguments
        const args = ['-i', input, '-y', ...commands.split(' '), output]
        console.log(`FFmpeg command: ffmpeg ${args.join(' ')}`)

        // Spawn the FFmpeg process
        const ffmpeg = spawn('ffmpeg', args)

        let durationSeconds = 0
        let currentTime = 0
        const startTime = Date.now()

        // Handle standard error data (FFmpeg's usual output channel)
        ffmpeg.stderr.on('data', (data) => {
            const dataStr = data.toString()

            if (!durationSeconds) {
                const durationMatch = dataStr.match(
                    /Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/
                )
                if (durationMatch) {
                    const hours = parseFloat(durationMatch[1])
                    const minutes = parseFloat(durationMatch[2])
                    const seconds = parseFloat(durationMatch[3])
                    durationSeconds = hours * 3600 + minutes * 60 + seconds
                }
            }

            const timeMatch = dataStr.match(
                /time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/
            )
            if (timeMatch) {
                const hours = parseFloat(timeMatch[1])
                const minutes = parseFloat(timeMatch[2])
                const seconds = parseFloat(timeMatch[3])
                currentTime = hours * 3600 + minutes * 60 + seconds

                if (durationSeconds) {
                    const progress = (currentTime / durationSeconds) * 100
                    const elapsedTime = (Date.now() - startTime) / 1000
                    const estimatedTotalTime = elapsedTime / (progress / 100)
                    const estimatedTimeRemaining =
                        estimatedTotalTime - elapsedTime
                    const formattedETR = formatTime(estimatedTimeRemaining)
                    onProgress(Math.floor(progress), formattedETR)
                }
            }
        })

        ffmpeg.on('error', (error) => {
            console.error('Error occurred in FFmpeg process:', error)
        })

        // Handle process completion
        ffmpeg.on('close', (code) => {
            if (code === 0) {
                onProgress(100, '00:00:00') // Final call with zero time remaining
                resolve()
            } else {
                reject(new Error(`FFmpeg exited with code ${code}`))
            }
        })
    })
}

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return [h, m, s].map((v) => (v < 10 ? '0' + v : v)).join(':')
}
