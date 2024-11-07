import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TarotsService } from '@res/tarots/tarots.service';
import { DrawTarotDto } from './dto/draw-tarot.dto';
import { createResponse } from '@/src/utils/create-response.util';

@ApiTags('Tarot')
@Controller('tarots')
export class TarotsController {
  constructor(private readonly tarotsService: TarotsService) {}

  @CsrfHeaders('타로 카드 뽑기')
  @Get('draw')
  async drawTarot(@Query() drawTarotDto: DrawTarotDto) {
    const { mainTitle } = drawTarotDto;
    const decodedMainTitle = decodeURIComponent(mainTitle); // 한글 디코딩
    const tarotCards = await this.tarotsService.drawTarot(decodedMainTitle);
    return createResponse(200, 'successful', tarotCards);
  }
}
