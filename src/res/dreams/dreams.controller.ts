import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import { Controller, Get, Query } from '@nestjs/common';
import { DreamsService } from '@res/dreams/dreams.service';
import { InterpretDreamDto } from './dto/interpret-dteam.dto';
import { createResponse } from '@/src/utils/create-response.util';

@Controller('dreams')
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}

  @CsrfHeaders('꿈 해몽')
  @Get('interpret')
  async interpretDream(@Query() interpretDreamDto: InterpretDreamDto) {
    const { title, description } = interpretDreamDto;
    const decodedTitle = decodeURIComponent(title); // 한글 디코딩
    const decodedDescription = decodeURIComponent(description); // 한글 디코딩

    const interpretation = await this.dreamsService.interpretDream(
      decodedTitle,
      decodedDescription,
    );

    return createResponse(200, 'successful', interpretation);
  }
}
