import mime from 'mime-types'
import sharp, { ResizeOptions } from 'sharp'

import { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../../services/prisma.service'
import { UtilitiesService } from '../../utilities/utilities.service'
import { Queues, AssetJobs, ThumbnailJobData } from '../jobs.constants'

@Processor(Queues.ASSET)
export class AssetProcessor {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly prismaService: PrismaService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  @Process({
    concurrency: 2,
    name: AssetJobs.THUMBNAIL,
  })
  async process(job: Job<ThumbnailJobData>) {
    const { assetId } = job.data
    await job.progress(100)
    console.log(`done with ${assetId}`)

    // TODO :: Keeping this code around for now because it shows a good example of streaming from s3
    // const response = await s3.send(
    //   new GetObjectCommand({
    //     Key: image.storageKey,
    //     Bucket: image.storageBucket,
    //   })
    // )
    // const streamingS3Body = response.Body as Readable

    // // Send the original image if no format is specified
    // if (!query.fmt) {
    //   res.header('Content-Type', image.contentType).send(streamingS3Body)
    //   return
    // }

    // const streamingImageTransformer = sharp()
    //   .toFormat(query.fmt, {
    //     progressive: true,
    //     effort: query.effort || 4,
    //     quality: query.q || 80,
    //   })
    //   .resize(
    //     Object.entries(query).reduce((acc, [k, v]) => {
    //       if (k === 'fit') acc.fit = v
    //       if (k === 'w') acc.width = Number(v)
    //       if (k === 'h') acc.width = Number(v)
    //       return acc
    //     }, {} as ResizeOptions)
    //   )

    // return res
    //   .header('Content-Type', mime.contentType(query.fmt) || image.contentType)
    //   .send(streamingS3Body.pipe(streamingImageTransformer))

    const asset = await this.prismaService.asset.findUnique({
      where: {
        id: assetId,
      },
    })

    console.log('grabbing a thumbnail from the video', asset.id)
    // const thumbnail = await this.utilitiesService.ffmpeg()

    console.log('compressing the thumbnail based on user input and defaults')

    console.log('uploading the thumbnail to s3')

    console.log('returning the thumbnail url')
    return 'done'
  }
}
