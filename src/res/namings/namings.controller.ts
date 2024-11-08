import { Controller, Get, Query } from '@nestjs/common';
import { NamingsService } from '@res/namings/namings.service';
import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import { DrawNamingDto } from './dto/draw-naming.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Namings')
@Controller('namings')
export class NamingsController {
  constructor(private readonly namingsService: NamingsService) {}

  @CsrfHeaders('AI 작명')
  @Get('draw')
  async drawNaming(@Query() drawNamingDto: DrawNamingDto) {
    const { mainTitle, content } = drawNamingDto;
    const decodedMainTitle = decodeURIComponent(mainTitle); // 한글 디코딩
    const namingCards = await this.namingsService.drawNaming(
      decodedMainTitle,
      content,
    );
    return createResponse(200, 'successful', namingCards);
  }
}
