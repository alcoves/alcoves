import mime from 'mime-types'

import { Asset } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { JobsService } from '../jobs/jobs.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { PrismaService } from '../services/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

interface ExtendedAsset extends Asset {
  url: string
}

@Injectable()
export class AssetsService {
  constructor(
    private readonly jobsService: JobsService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  createAssetStorageKey(id: string): string {
    return `assets/${id}`
  }

  async findAll(): Promise<ExtendedAsset[]> {
    const assets = await this.prismaService.asset.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return assets.map((asset) => {
      return {
        ...asset,
        url: `http://localhost:9000/${asset.storageBucket}/${asset.storageKey}/original.mp4`,
      }
    })
  }

  async findOne(id: string): Promise<ExtendedAsset> {
    const asset = await this.prismaService.asset.findFirst({
      where: { id },
    })

    if (!asset) throw new NotFoundException('Asset not found')

    return {
      ...asset,
      url: `http://localhost:9000/${asset.storageBucket}/${asset.storageKey}/original.mp4`,
    }
  }

  async create(createAssetDto: CreateAssetDto): Promise<ExtendedAsset> {
    const assetId = uuidv4()
    const contentType = mime.lookup(createAssetDto.input)

    // Could also do an options request to get the contentType
    if (!contentType)
      throw new Error('Invalid content type, please set a valid content type')

    await this.prismaService.asset.create({
      data: {
        id: assetId,
        contentType,
        input: createAssetDto.input,
        storageKey: this.createAssetStorageKey(assetId),
        storageBucket: this.configService.get('ALCOVES_STORAGE_BUCKET'),
      },
    })

    await this.jobsService.ingestAsset(assetId)
    return this.findOne(assetId)
  }

  async remove(id: string): Promise<string | NotFoundException> {
    const asset = await this.findOne(id)

    if (!asset) return new NotFoundException('Asset not found')
    await this.prismaService.asset.delete({
      where: { id },
    })

    return 'message deleted'
  }
}
