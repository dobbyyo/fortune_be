import { Injectable } from '@nestjs/common';
import { UpdateNamingDto } from '@res/namings/dto/update-naming.dto';
import { CreateNamingDto } from '@res/namings/dto/create-naming.dto';

@Injectable()
export class NamingsService {
  create(createNamingDto: CreateNamingDto) {
    return 'This action adds a new naming';
  }

  findAll() {
    return `This action returns all namings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} naming`;
  }

  update(id: number, updateNamingDto: UpdateNamingDto) {
    return `This action updates a #${id} naming`;
  }

  remove(id: number) {
    return `This action removes a #${id} naming`;
  }
}
