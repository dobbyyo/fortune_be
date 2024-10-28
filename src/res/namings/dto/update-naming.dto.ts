import { PartialType } from '@nestjs/swagger';
import { CreateNamingDto } from './create-naming.dto';

export class UpdateNamingDto extends PartialType(CreateNamingDto) {}
