import { Asset } from '@prisma/client'
import { CreateAssetDto } from './dto/create-asset.dto'
import { PrismaService } from '../services/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class AssetsService {
  constructor(private readonly prismaService: PrismaService) {}

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
    const asset = await this.prismaService.asset.create({
      data: {
        storageKey: 'test',
        storageBucket: 'test',
        ...createAssetDto,
      },
    })

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
