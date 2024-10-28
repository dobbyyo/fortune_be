import { PartialType } from '@nestjs/swagger';
import { CreateFortuneDto } from './create-fortune.dto';

export class UpdateFortuneDto extends PartialType(CreateFortuneDto) {}
