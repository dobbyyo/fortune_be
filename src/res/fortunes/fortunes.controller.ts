import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FortunesService } from '@res/fortunes/fortunes.service';
import { CreateFortuneDto } from '@res/fortunes/dto/create-fortune.dto';
import { UpdateFortuneDto } from '@res/fortunes/dto/update-fortune.dto';

@Controller('fortunes')
export class FortunesController {
  constructor(private readonly fortunesService: FortunesService) {}

  @Post()
  create(@Body() createFortuneDto: CreateFortuneDto) {
    return this.fortunesService.create(createFortuneDto);
  }

  @Get()
  findAll() {
    return this.fortunesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fortunesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFortuneDto: UpdateFortuneDto) {
    return this.fortunesService.update(+id, updateFortuneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fortunesService.remove(+id);
  }
}
