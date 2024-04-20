import { Worker } from 'bullmq'
import { bullConnection, transcodeQueue } from './bullmq'

const worker = new Worker(
    transcodeQueue.name,
    async (job) => {
        switch (job.name) {
            case 'transcode':
                // Do the transcode
                break
            case 'thumbnail':
                // Generate the signed url
                break
            default:
                break
        }

        console.log(job.data)
        // Get a long lived link to the upload
        // Get the video metadata
        // Take the video and turn it into hls assets in 264 720p
        // Take the output dir and put it in s3
    },
    { connection: bullConnection }
)

worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`)
})

worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`)
})
