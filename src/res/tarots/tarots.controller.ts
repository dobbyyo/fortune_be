import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TarotsService } from '@res/tarots/tarots.service';
import { CreateTarotDto } from '@res/tarots/dto/create-tarot.dto';
import { UpdateTarotDto } from '@res/tarots/dto/update-tarot.dto';

@Controller('tarots')
export class TarotsController {
  constructor(private readonly tarotsService: TarotsService) {}

  @Post()
  create(@Body() createTarotDto: CreateTarotDto) {
    return this.tarotsService.create(createTarotDto);
  }

  @Get()
  findAll() {
    return this.tarotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarotsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTarotDto: UpdateTarotDto) {
    return this.tarotsService.update(+id, updateTarotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarotsService.remove(+id);
  }
}
