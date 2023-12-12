import { AssetStatus } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class GetAssetsQueryDto {
  @IsOptional()
  @IsEnum(AssetStatus)
  status: string
}
