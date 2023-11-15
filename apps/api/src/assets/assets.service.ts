import { Asset } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { JobsService } from '../jobs/jobs.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { PrismaService } from '../services/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

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

  async findAll(): Promise<Asset[]> {
    const assets = await this.prismaService.asset.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return assets
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.prismaService.asset.findFirst({
      where: { id },
    })

    return asset
  }

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const assetId = uuidv4()
    const asset = await this.prismaService.asset.create({
      data: {
        id: assetId,
        input: createAssetDto.input,
        storageKey: this.createAssetStorageKey(assetId),
        storageBucket: this.configService.get('ALCOVES_STORAGE_BUCKET'),
      },
    })

    await this.jobsService.ingestAsset(assetId)
    return asset
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
