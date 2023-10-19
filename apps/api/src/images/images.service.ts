import mime from 'mime'

import { v4 as uuidv4 } from 'uuid'
import { Injectable } from '@nestjs/common'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { PrismaService } from '../services/prisma.service'

import axios, { ResponseType } from 'axios'
import { PassThrough } from 'stream'
import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

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

  findOne(id: number) {
    return `This action returns a #${id} image`
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`
  }

  remove(id: number) {
    return `This action removes a #${id} image`
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
