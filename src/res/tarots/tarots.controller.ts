import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TarotsService } from '@res/tarots/tarots.service';
import { DrawTarotDto } from './dto/draw-tarot.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { TarotInterpretationDto } from './dto/interpret-tarot.dto';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { SaveTarotCardDto } from './dto/save-tarot.dto';
import { Request } from 'express';

@ApiTags('Tarot')
@Controller('tarots')
export class TarotsController {
  constructor(private readonly tarotsService: TarotsService) {}

  @CsrfHeaders('타로 카드 뽑기')
  @Get('draw')
  async drawTarot(@Query() drawTarotDto: DrawTarotDto) {
    const { mainTitle } = drawTarotDto;
    const decodedMainTitle = decodeURIComponent(mainTitle);
    const tarotCards = await this.tarotsService.drawTarot(decodedMainTitle);
    return createResponse(200, 'successful', tarotCards);
  }

  @CsrfHeaders('타로 카드 해석')
  @Post('interpret-tarot')
  async interpretTarotCards(
    @Body() tarotInterpretationDto: TarotInterpretationDto,
  ) {
    const interpretations = await this.tarotsService.interpretTarotCards(
      tarotInterpretationDto,
    );
    return createResponse(200, 'successful', interpretations);
  }

  @AuthAndCsrfHeaders('타로 카드 저장')
  @UseGuards(JwtAuthGuard)
  @Post('save')
  async saveTarotCards(
    @Req() req: Request,
    @Body() saveTarotCardDto: SaveTarotCardDto,
  ) {
    const { userId } = req.user;

    const savedCards = await this.tarotsService.saveTarotCards(
      userId,
      saveTarotCardDto,
    );
    return createResponse(
      200,
      '타로 카드가 성공적으로 저장되었습니다.',
      savedCards,
    );
  }

  @AuthAndCsrfHeaders('타로 카드 저장 취소')
  @UseGuards(JwtAuthGuard)
  @Delete('cancel/:savedCardId')
  async cancelSavedTarotCard(
    @Req() req: Request,
    @Param('savedCardId') savedCardId: number,
  ) {
    const { userId } = req.user;
    await this.tarotsService.cancelSavedTarotCard(userId, savedCardId);
    return createResponse(200, '타로 카드 저장이 취소되었습니다.');
  }
}
