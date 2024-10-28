import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NamingsService } from '@res/namings/namings.service';
import { CreateNamingDto } from '@res/namings/dto/create-naming.dto';
import { UpdateNamingDto } from '@res/namings/dto/update-naming.dto';

@Controller('namings')
export class NamingsController {
  constructor(private readonly namingsService: NamingsService) {}

  @Post()
  create(@Body() createNamingDto: CreateNamingDto) {
    return this.namingsService.create(createNamingDto);
  }

  @Get()
  findAll() {
    return this.namingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.namingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNamingDto: UpdateNamingDto) {
    return this.namingsService.update(+id, updateNamingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.namingsService.remove(+id);
  }
}
