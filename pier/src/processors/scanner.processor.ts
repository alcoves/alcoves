import * as path from 'path'
import * as fs from 'fs-extra'
import * as crypto from 'crypto'

import { Job, Queue } from 'bullmq'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../services/prisma.service'
import {
  JOB_QUEUES,
  ScannerProcessorInputs,
  ThumbnailProcessorInputs,
} from '../types'
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq'

@Processor(JOB_QUEUES.SCANNER)
export class ScannerProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    @InjectQueue(JOB_QUEUES.THUMBNAILS) private thumbnailQueue: Queue
  ) {
    super()
  }

  parseDate(dateString: string): Date | null {
    try {
      const re = /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/
      const matches = re.test(dateString)

      if (matches) {
        const [datePart, timePart] = dateString.split('_')
        const [year, month, day] = datePart.split('-').map(Number)
        const [hours, minutes, seconds] = timePart.split('-').map(Number)

        // Note that the month argument to Date constructor is 0-indexed, so we subtract 1 from the parsed month value
        const date = new Date(year, month - 1, day, hours, minutes, seconds)

        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return null
        }

        return date
      }
    } catch (error) {
      console.error(error)
    }
  }

  hashFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const md5sum = crypto.createHash('md5')
      const stream = fs.createReadStream(filePath)

      stream.on('error', (error) => {
        reject(error)
      })

      md5sum.once('readable', () => {
        const hash = md5sum.read().toString('hex')
        resolve(hash)
      })

      stream.pipe(md5sum)
    })
  }

  async process(job: Job<unknown>): Promise<any> {
    const jobData = job.data as ScannerProcessorInputs

    const videoFileInDb = await this.prisma.videoFile.findFirst({
      where: { location: jobData.path },
      include: { video: true },
    })

    if (!videoFileInDb) {
      if (!(await fs.exists(jobData.path))) {
        console.log(`file ${jobData.path} does not exist`)
        return
      }

      console.info(`scanning ${jobData.path}`)
      const stat = await fs.stat(jobData.path)
      const size = stat.size / (1024 * 1024)

      // Warning: this is a bit of a hack
      // /videos/gameDir/video.mp4
      const tagName = jobData.path.split('/')[2]

      await this.prisma.video.create({
        data: {
          title: path.basename(jobData.path),
          authoredAt:
            this.parseDate(path.basename(jobData.path).split('.')[0]) ||
            new Date(),
          tags: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
          playbacks: {
            create: [
              {
                size,
                location: jobData.path,
                // hash: await this.hashFile(jobData.path),
              },
            ],
          },
        },
      })

      console.info(`successfully scanned ${jobData.path}`)
    } else {
      // queue up some thumbnails
      this.thumbnailQueue.add('thumbnail', {
        videoId: videoFileInDb.video.id,
      } as ThumbnailProcessorInputs)
      console.info(`skipping ${jobData.path}`)
    }
  }
}
