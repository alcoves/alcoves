// import axios from 'axios'

// import { Job, Queue } from 'bull'
// // import { S3 } from 'aws-sdk'
// import { Queues } from '../types/types'
// import { ConfigService } from '@nestjs/config'
// import { InjectQueue, Process, Processor } from '@nestjs/bull'
// import { PrismaService } from '../services/prisma.service'
// // import { VideosService } from '../videos/videos.service'

// export interface IngestJob extends Job {
//   data: {
//     input: string
//     videoId: string
//   }
// }

// @Processor(Queues.ingest.name)
// export class IngestProcessor {
//   constructor(
//     private prisma: PrismaService,
//     // private videoService: VideosService,
//     private configService: ConfigService,
//     @InjectQueue(Queues.thumbnail.name) private thumbnailQueue: Queue,
//     @InjectQueue(Queues.transcode.name) private transcodeQueue: Queue
//   ) {}

//   s3c() {
//     const endpoint = this.configService.get('STORAGE_ENDPOINT')
//     const internalEndpoint = this.configService.get('STORAGE_ENDPOINT_INTERNAL')

//     // return new S3({
//     //   region: 'localhost',
//     //   s3ForcePathStyle: true,
//     //   signatureVersion: 'v4',
//     //   endpoint: internalEndpoint || endpoint,
//     //   accessKeyId: this.configService.get('STORAGE_ACCESS_KEY_ID'),
//     //   secretAccessKey: this.configService.get('STORAGE_SECRET_ACCESS_KEY'),
//     // })
//   }

//   @Process({
//     name: 'ingestFromURL',
//     concurrency: 2,
//   })
//   async ingestFromURL(job: IngestJob): Promise<any> {
//     try {
//       console.log('Downloading video from url', job.data)
//       const response = await axios.get(job.data.input, {
//         responseType: 'stream',
//       })

//       const uploadParams = {
//         Bucket: this.configService.get('STORAGE_BUCKET'),
//         Key: `${this.configService.get<string>(
//           'STORAGE_BUCKET_VIDEO_PREFIX'
//         )}/${job.data.videoId}/original.mp4`,
//         Body: response.data,
//       }

//       await this.s3c().upload(uploadParams).promise()

//       await this.thumbnailQueue.add('thumbnailVideo', {
//         videoId: job.data.videoId,
//       })

//       await this.transcodeQueue.add('transcodeToHLS', {
//         videoId: job.data.videoId,
//       })

//       await job.progress(100)
//       console.log('Job done!')
//       return {}
//     } catch (error) {
//       console.error('Error', error.message)
//     }
//   }
// }
