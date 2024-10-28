import { Injectable } from '@nestjs/common';
import { CreateTarotDto } from '@res/tarots/dto/create-tarot.dto';
import { UpdateTarotDto } from '@res/tarots/dto/update-tarot.dto';

@Injectable()
export class TarotsService {
  create(createTarotDto: CreateTarotDto) {
    return 'This action adds a new tarot';
  }

  findAll() {
    return `This action returns all tarots`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tarot`;
  }

  update(id: number, updateTarotDto: UpdateTarotDto) {
    return `This action updates a #${id} tarot`;
  }

  remove(id: number) {
    return `This action removes a #${id} tarot`;
  }
}
