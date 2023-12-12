import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator'

enum Formats {
  avif = 'avif',
  gif = 'gif',
  heif = 'heif',
  jpeg = 'jpeg',
  jpg = 'jpg',
  jp2 = 'jp2',
  jxl = 'jxl',
  png = 'png',
  svg = 'svg',
  tiff = 'tiff',
  tif = 'tif',
  webp = 'webp',
}

enum Fit {
  contain = 'contain',
  cover = 'cover',
  fill = 'fill',
  inside = 'inside',
  outside = 'outside',
}

export class GetThumbnailParamsDto {
  @IsUUID()
  assetId: string

  @IsEnum(Formats)
  fmt: string
}

export class GetThumbnailQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  t: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  q: number

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(12)
  effort: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12000)
  w: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12000)
  h: number

  @IsOptional()
  @IsEnum(Fit)
  fit: string
}
