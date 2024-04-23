import { Worker } from 'bullmq'
import { bullConnection, transcodeQueue } from './bullmq/bullmq'

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
        // const signedUrl = getSignedUrl
        // const videoMetadata = getVideoMetadata
        // const hlsAssets = transcodeVideo
        // const outputDir = putInS3
    },
    { connection: bullConnection }
)

worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`)
})

worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`)
})
