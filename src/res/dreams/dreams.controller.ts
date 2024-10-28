import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DreamsService } from '@res/dreams/dreams.service';
import { CreateDreamDto } from '@res/dreams/dto/create-dream.dto';
import { UpdateDreamDto } from '@res/dreams/dto/update-dream.dto';

@Controller('dreams')
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}

  @Post()
  create(@Body() createDreamDto: CreateDreamDto) {
    return this.dreamsService.create(createDreamDto);
  }

  @Get()
  findAll() {
    return this.dreamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dreamsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDreamDto: UpdateDreamDto) {
    return this.dreamsService.update(+id, updateDreamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dreamsService.remove(+id);
  }
}
