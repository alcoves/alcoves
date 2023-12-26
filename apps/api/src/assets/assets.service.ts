import mime from 'mime-types'

import { Asset, AssetStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { JobsService } from '../jobs/jobs.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { PrismaService } from '../services/prisma.service'
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { UtilitiesService } from '../utilities/utilities.service'
import { GetAssetsQueryDto } from './dto/getAssetsDto'

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name)

  constructor(
    private readonly jobsService: JobsService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  async findAll(query: GetAssetsQueryDto): Promise<Asset[]> {
    const prismaQuery = {
      where: {},
      take: -1,
      orderBy: {
        createdAt: 'desc',
      },
    } as any

    if (query.limit) {
      prismaQuery.take = query.limit
    }

    if (query.status) {
      prismaQuery.where = {
        status: AssetStatus[query.status],
      }
    }

    const assets = await this.prismaService.asset.findMany(prismaQuery as any)
    return assets
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.prismaService.asset.findFirst({
      where: { id },
    })

    if (!asset) throw new NotFoundException('Asset not found')

    return asset
  }

  async retryIngest(id: string): Promise<Asset | NotFoundException> {
    const asset = await this.findOne(id)
    if (!asset) return new NotFoundException('Asset not found')

    await this.jobsService.ingestAsset(id)
    return this.findOne(id)
  }

  async retryStoryboard(id: string): Promise<Asset | NotFoundException> {
    const asset = await this.findOne(id)
    if (!asset) return new NotFoundException('Asset not found')

    await this.jobsService.createStoryboards(id)
    return this.findOne(id)
  }

  async reprocess() {
    const assets = await this.prismaService.asset.findMany({
      include: {
        storyboard: true,
      },
    })

    return {
      assets: assets.length,
    }
  }

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
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
        storageKey: this.utilitiesService.createAssetStorageKey(assetId),
        storageBucket: this.configService.get('ALCOVES_STORAGE_BUCKET'),
      },
    })

    await this.jobsService.ingestAsset(assetId)
    return this.findOne(assetId)
  }

  async remove(id: string): Promise<string | NotFoundException> {
    const asset = await this.findOne(id)
    if (!asset) return new NotFoundException('Asset not found')

    if (asset.status === 'READY' || asset.status === 'ERROR') {
      await this.jobsService.deleteStorageFolder(
        asset.storageBucket,
        asset.storageKey
      )
      await this.prismaService.asset.delete({
        where: { id },
      })
    } else {
      throw new BadRequestException('Asset is not ready to be deleted')
    }
  }
}
