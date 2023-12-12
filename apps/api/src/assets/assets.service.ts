import mime from 'mime-types'

import { Asset } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { JobsService } from '../jobs/jobs.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { PrismaService } from '../services/prisma.service'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UtilitiesService } from '../utilities/utilities.service'

@Injectable()
export class AssetsService {
  constructor(
    private readonly jobsService: JobsService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService
  ) {}

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

    if (!asset) throw new NotFoundException('Asset not found')

    return asset
  }

  async retryIngest(id: string): Promise<Asset | NotFoundException> {
    const asset = await this.findOne(id)
    if (!asset) return new NotFoundException('Asset not found')

    await this.jobsService.ingestAsset(id)
    return this.findOne(id)
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
