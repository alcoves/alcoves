import { Queues } from '../types'
import { Process, Processor } from '@nestjs/bull'

@Processor(Queues.thumbnail.name)
export class ThumbnailProcessor {
  @Process({
    name: 'thumbnailVideo',
    concurrency: 5,
  })
  async thumbnailVideo(job: any): Promise<any> {
    try {
      console.log('Thumbnailing video', job.data.videoId)

      // const commands = [
      //   '-i',
      //   video.playbacks[0].location,
      //   '-frames:v',
      //   '1',
      //   tmpOutputPath,
      // ];

      await job.progress(100)
      console.log('Job done!')
      return {}
    } catch (error) {
      console.error('Error', error)
    }
  }
}

// import * as sharp from 'sharp';
// import * as fs from 'fs-extra';

// import { Job } from 'bullmq';
// import { v4 as uuid } from 'uuid';
// import { ConfigService } from '@nestjs/config';
// import { createFFMpeg } from '../utils/ffmpeg';
// import { Processor, WorkerHost } from '@nestjs/bull';
// import { PrismaService } from '../services/prisma.service';
// import { JOB_QUEUES, ThumbnailProcessorInputs } from '../types';

// @Processor(JOB_QUEUES.THUMBNAILS)
// export class ThumbnailProcessor extends WorkerHost {
//   constructor(
//     private prisma: PrismaService,
//     private configService: ConfigService,
//   ) {
//     super();
//   }

//   async process(job: Job<unknown>): Promise<any> {
//     const jobData = job.data as ThumbnailProcessorInputs;

//     const video = await this.prisma.video.findUnique({
//       where: { id: jobData.videoId },
//       include: { playbacks: true },
//     });

//     if (!video) return 'no video';

//     const tmpDirRoot = this.configService.get('paths.tmp');
//     const tmpDir = await fs.mkdtemp(`${tmpDirRoot}/thumbnail-`);
//     console.log(`using ${tmpDir} as temporary directory`);

//     try {
//       console.log('processing thumbnail', jobData.videoId);
//       const tmpOutputPath = tmpDir + '/thumbnail.png';
//       const commands = [
//         '-i',
//         video.playbacks[0].location,
//         '-frames:v',
//         '1',
//         tmpOutputPath,
//       ];

//       await new Promise((resolve, reject) => {
//         const ffmpegProcess = createFFMpeg(commands);
//         ffmpegProcess.on('progress', (progress: number) => {
//           console.log(`Progress`, { progress });
//         });
//         ffmpegProcess.on('success', (res) => {
//           console.log('Conversion successful');
//           resolve(res);
//         });
//         ffmpegProcess.on('error', (error: Error) => {
//           console.error(`Conversion failed: ${error.message}`);
//           reject('Conversion failed');
//         });
//       });

//       const thumbnails = await this.prisma.imageFile.findMany({
//         where: {
//           videoId: jobData.videoId,
//         },
//       });

//       const thumbnailQualities = [
//         {
//           id: uuid(),
//           size: {
//             w: 640,
//             h: 360,
//           },
//           avif: {
//             quality: 50,
//             effort: 6,
//           },
//         },
//         {
//           id: uuid(),
//           size: {
//             w: 1280,
//             h: 720,
//           },
//           avif: {
//             quality: 70,
//             effort: 6,
//           },
//         },
//       ];

//       for (const thumbnail of thumbnailQualities) {
//         const thumbnailOutputPath = `${this.configService.get(
//           'paths.thumbnails',
//         )}/${thumbnail.id}.avif`;

//         await sharp(tmpOutputPath)
//           .resize(thumbnail.size.w, thumbnail.size.h)
//           .avif(thumbnail.avif)
//           .toFile(thumbnailOutputPath);

//         const stat = await fs.stat(thumbnailOutputPath);
//         const size = stat.size / (1024 * 1024);

//         await this.prisma.imageFile.create({
//           data: {
//             size,
//             id: thumbnail.id,
//             width: thumbnail.size.w,
//             height: thumbnail.size.h,
//             location: thumbnailOutputPath,
//             video: {
//               connect: {
//                 id: jobData.videoId,
//               },
//             },
//           },
//         });
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       await fs.remove(tmpDir);
//     }
//   }
// }
