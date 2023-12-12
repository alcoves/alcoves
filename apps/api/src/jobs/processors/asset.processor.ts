import os from 'os'
import path from 'path'
import mime from 'mime-types'
import sharp, { ResizeOptions } from 'sharp'

import { Job } from 'bull'
import { Duration } from 'luxon'
import { Logger } from '@nestjs/common'
import { mkdtemp, rm } from 'fs/promises'
import { Process, Processor } from '@nestjs/bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../../services/prisma.service'
import { UtilitiesService } from '../../utilities/utilities.service'
import { Queues, AssetJobs, ThumbnailJobData } from '../jobs.constants'

function formatTimestring(d: number) {
  const duration = Duration.fromObject({ seconds: d })
  return duration.toFormat('hh:mm:ss')
}

@Processor(Queues.ASSET)
export class AssetProcessor {
  private readonly logger = new Logger(AssetProcessor.name)

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly prismaService: PrismaService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  getThumbnailStorageKey(asset, params, query) {
    let key = `${asset.storageKey}/thumbnails.${params.fmt}`
    if (Object.keys(query).length) {
      const sortedQuery = Object.entries(query).sort((a, b) =>
        a[0].localeCompare(b[0])
      )
      key += `?${sortedQuery.map(([k, v]) => `${k}=${v}`).join('&')}`
    }

    return key
  }

  @Process({
    concurrency: 8,
    name: AssetJobs.THUMBNAIL,
  })
  async process(job: Job<ThumbnailJobData>) {
    const { assetId, query, params } = job.data
    const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'aloves-thumbnail-'))
    const sourceThumbnailPath = `${tmpDir}/source-thumbnail.png`
    const outputThumbnailPath = `${tmpDir}/output-thumbnail.${params.fmt}`
    this.logger.debug({ tmpDir, sourceThumbnailPath, outputThumbnailPath })

    try {
      const asset = await this.prismaService.asset.findUnique({
        where: {
          id: assetId,
        },
      })

      this.logger.log('grabbing a thumbnail from the video', asset.id)
      const ss = query.t ? `${formatTimestring(query.t)}` : '00:00:00'
      const thumbnail = await this.utilitiesService.getThumbnail(
        asset,
        sourceThumbnailPath,
        ss
      )
      await job.progress(25)

      this.logger.log(
        'compressing the thumbnail based on user input and defaults'
      )
      const sharpObject = await sharp(sourceThumbnailPath)
        .toFormat(params.fmt as any, {
          progressive: true,
          effort: query.effort || 4,
          quality: query.q || 80,
        })
        .resize(
          Object.entries(query).reduce((acc, [k, v]) => {
            if (k === 'fit') acc.fit = v
            if (k === 'w') acc.width = Number(v)
            if (k === 'h') acc.width = Number(v)
            return acc
          }, {} as ResizeOptions)
        )
        .toFile(outputThumbnailPath)
        .catch((error) => {
          this.logger.error(error)
          throw error
        })
      await job.progress(50)

      this.logger.log('uploading the thumbnail to s3')
      const thumbnailStorageKey = this.getThumbnailStorageKey(
        asset,
        params,
        query
      )

      const fileUploaded = await this.utilitiesService.uploadFileToStorage(
        outputThumbnailPath,
        mime.lookup(outputThumbnailPath) || 'application/octet-stream',
        asset.storageBucket,
        thumbnailStorageKey
      )
      await job.progress(75)

      this.logger.log('cleaning up directories and returning')
      await job.progress(100)
      return {
        bucket: asset.storageBucket,
        key: thumbnailStorageKey,
      }
    } catch (error) {
      this.logger.error(error)
      throw error
    } finally {
      await rm(tmpDir, { recursive: true })
    }

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
  }
}
