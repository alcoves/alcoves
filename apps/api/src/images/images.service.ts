import mime from 'mime'

import { v4 as uuidv4 } from 'uuid'
import { Injectable } from '@nestjs/common'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { PrismaService } from '../services/prisma.service'

import axios, { ResponseType } from 'axios'
import { PassThrough, Readable } from 'stream'
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import sharp, { ResizeOptions } from 'sharp'
import { GetImageParamsDto, GetImageQueryDto } from './dto/get-image-dto'
import { FastifyReply } from 'fastify'

const s3 = new S3({
  region: 'us-east-1',
  forcePathStyle: true,
  endpoint: 'http://minio:9000',
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin',
  },
})

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImageDto: CreateImageDto) {
    const { input } = createImageDto
    const imageId = uuidv4()

    const storageBucket = 'alcoves'
    const storageKey = `images/${imageId}/${imageId}`
    const contentType = await this.ingest(input, storageBucket, storageKey)

    return this.prisma.image.create({
      data: {
        id: imageId,
        input,
        storageKey,
        contentType,
        storageBucket,
      },
    })
  }

  findAll() {
    return this.prisma.image.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  findOne(id: string) {
    return this.prisma.image.findUnique({ where: { id } })
  }

  async transformOne(
    params: GetImageParamsDto,
    query: GetImageQueryDto,
    res: FastifyReply
  ) {
    const image = await this.prisma.image.findUnique({
      where: {
        id: params.id,
      },
    })

    const response = await s3.send(
      new GetObjectCommand({
        Key: image.storageKey,
        Bucket: image.storageBucket,
      })
    )
    const streamingS3Body = response.Body as Readable

    // Send the original image if no format is specified
    if (!query.fmt) {
      res.header('Content-Type', image.contentType).send(streamingS3Body)
      return
    }

    const streamingImageTransformer = sharp()
      .toFormat(query.fmt, {
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

    return res
      .header('Content-Type', mime.getType(query.fmt) || image.contentType)
      .send(streamingS3Body.pipe(streamingImageTransformer))
  }

  async ingest(input: string, bucket: string, key: string): Promise<string> {
    const response = await axios({
      url: input,
      method: 'get',
      responseType: 'stream' as ResponseType,
    })

    const passThrough = new PassThrough()
    response.data.pipe(passThrough)

    const contentType = response.headers['content-type'] || mime.getType(input)

    if (!contentType) {
      throw new Error('Could not determine content type')
    }

    await new Upload({
      client: s3,
      queueSize: 4,
      leavePartsOnError: false,
      params: {
        Key: key,
        Bucket: bucket,
        Body: passThrough,
        ContentType: contentType,
      },
    }).done()

    return contentType
  }
}
