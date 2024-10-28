import { PartialType } from '@nestjs/swagger';
import { CreateTarotDto } from '@res/tarots/dto/create-tarot.dto';

export class UpdateTarotDto extends PartialType(CreateTarotDto) {}
