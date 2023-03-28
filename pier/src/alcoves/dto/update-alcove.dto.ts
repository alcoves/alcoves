import { PartialType } from '@nestjs/swagger';
import { CreateAlcoveDto } from './create-alcove.dto';

export class UpdateAlcoveDto extends PartialType(CreateAlcoveDto) {}
