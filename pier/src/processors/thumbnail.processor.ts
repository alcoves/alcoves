import * as sharp from 'sharp'
import * as fs from 'fs-extra'

import { Job } from 'bullmq'
import { v4 as uuid } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { createFFMpeg } from '../utils/ffmpeg'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { PrismaService } from '../services/prisma.service'
import { JOB_QUEUES, ThumbnailProcessorInputs } from '../types'

@Processor(JOB_QUEUES.THUMBNAILS)
export class ThumbnailProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    super()
  }

  async process(job: Job<unknown>): Promise<any> {
    const jobData = job.data as ThumbnailProcessorInputs

    const video = await this.prisma.video.findUnique({
      where: { id: jobData.videoId },
      include: { playbacks: true },
    })

    if (!video) return 'no video'

    const tmpDirRoot = this.configService.get('paths.tmp')
    const tmpDir = await fs.mkdtemp(`${tmpDirRoot}/thumbnail-`)
    console.log(`using ${tmpDir} as temporary directory`)

    try {
      console.log('processing thumbnail', jobData.videoId)
      const thumbnailId = uuid()

      const tmpOutputPath = tmpDir + '/thumbnail.png'
      const thumbnailOutputPath = `${this.configService.get(
        'paths.thumbnails'
      )}/${thumbnailId}.jpg`

      const commands = [
        '-i',
        video.playbacks[0].location,
        '-frames:v',
        '1',
        tmpOutputPath,
      ]

      await new Promise((resolve, reject) => {
        const ffmpegProcess = createFFMpeg(commands)
        ffmpegProcess.on('progress', (progress: number) => {
          console.log(`Progress`, { progress })
        })
        ffmpegProcess.on('success', (res) => {
          console.log('Conversion successful')
          resolve(res)
        })
        ffmpegProcess.on('error', (error: Error) => {
          console.error(`Conversion failed: ${error.message}`)
          reject('Conversion failed')
        })
      })

      await sharp(tmpOutputPath)
        .resize(1280, 720)
        .toFormat('jpeg')
        .jpeg({
          quality: 80,
          progressive: true,
        })
        .toFile(thumbnailOutputPath)

      // await sharp(tmpOutputPath)
      //   .resize(1280, 720)
      //   .avif({ quality: 70 })
      //   .toFile(thumbnailOutputPath)

      const thumbnails = await this.prisma.imageFile.findMany({
        where: {
          videoId: jobData.videoId,
        },
      })

      for (const thumbnail of thumbnails) {
        await fs.remove(thumbnail.location)
        await this.prisma.imageFile.delete({
          where: {
            id: thumbnail.id,
          },
        })
      }

      await this.prisma.imageFile.create({
        data: {
          id: thumbnailId,
          location: thumbnailOutputPath,
          video: {
            connect: {
              id: jobData.videoId,
            },
          },
        },
      })
    } catch (error) {
      console.error(error)
    } finally {
      await fs.remove(tmpDir)
    }
  }
}
