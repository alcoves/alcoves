import { IsNotEmpty, IsUrl } from 'class-validator'

export class CreateAssetDto {
  @IsUrl()
  @IsNotEmpty()
  input: string
}
