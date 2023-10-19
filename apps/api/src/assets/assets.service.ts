import { v4 as uuidv4 } from 'uuid'
import { Injectable } from '@nestjs/common'
import { CreateAssetDto } from './dto/create-asset.dto'
import { UpdateAssetDto } from './dto/update-asset.dto'
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
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssetDto: CreateAssetDto) {
    const { input } = createAssetDto
    const assetId = uuidv4()

    const storageBucket = 'alcoves'
    const storageKey = `assets/${assetId}/${assetId}.jpg`

    await this.ingest(input, storageBucket, storageKey)

    return this.prisma.asset.create({
      data: {
        id: assetId,
        input,
        name: 'test',
        storage_key: storageBucket,
        storage_bucket: storageKey,
      },
    })
  }

  findAll() {
    return `This action returns all assets`
  }

  findOne(id: number) {
    return `This action returns a #${id} asset`
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return `This action updates a #${id} asset`
  }

  remove(id: number) {
    return `This action removes a #${id} asset`
  }

  async ingest(input: string, bucket: string, key: string) {
    const response = await axios({
      url: input,
      method: 'get',
      responseType: 'stream' as ResponseType,
    })

    const passThrough = new PassThrough()
    response.data.pipe(passThrough)

    return new Upload({
      client: s3,
      queueSize: 4,
      leavePartsOnError: false,
      params: {
        Key: key,
        Bucket: bucket,
        Body: passThrough,
      },
    }).done()
  }
}
