import { Injectable } from '@nestjs/common';
import { CreateFortuneDto } from '@res/fortunes/dto/create-fortune.dto';
import { UpdateFortuneDto } from '@res/fortunes/dto/update-fortune.dto';

@Injectable()
export class FortunesService {
  create(createFortuneDto: CreateFortuneDto) {
    return 'This action adds a new fortune';
  }

  findAll() {
    return `This action returns all fortunes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fortune`;
  }

  update(id: number, updateFortuneDto: UpdateFortuneDto) {
    return `This action updates a #${id} fortune`;
  }

  remove(id: number) {
    return `This action removes a #${id} fortune`;
  }
}
