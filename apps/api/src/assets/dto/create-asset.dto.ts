import { IsNotEmpty, IsUrl } from 'class-validator'

export class CreateAssetDto {
  @IsUrl()
  @IsNotEmpty()
  input: string

  // @IsNotEmpty()
  // storageKey: string

  // @IsNotEmpty()
  // storageBucket: string
}
