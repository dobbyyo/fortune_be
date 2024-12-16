import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
import { DeleteTarotCardDto, SaveTarotCardDto } from './dto/save-tarot.dto';
import { Request } from 'express';
import { ShareTarotCardDto } from './dto/share-tarot.dto';

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
    const userData = req.user;

    if (Number(userData.userId) !== Number(saveTarotCardDto.userId)) {
      throw new BadRequestException('사용자 정보가 일치하지 않습니다');
    }

    const savedCards = await this.tarotsService.saveTarotCards(
      userData.userId,
      saveTarotCardDto,
    );
    return createResponse(200, 'Successful', savedCards);
  }

  @AuthAndCsrfHeaders('타로 카드 저장 취소')
  @UseGuards(JwtAuthGuard)
  @Delete('cancel')
  async cancelSavedTarotCard(
    @Req() req: Request,
    @Query() deleteTarotCardDto: DeleteTarotCardDto,
  ) {
    const userData = req.user;

    if (Number(userData.userId) !== Number(deleteTarotCardDto.userId)) {
      throw new BadRequestException('사용자 정보가 일치하지 않습니다');
    }

    await this.tarotsService.cancelSavedTarotCard(deleteTarotCardDto);
    return createResponse(200, 'Successful');
  }

  @AuthAndCsrfHeaders('타로카드 공유')
  @Post('share')
  async shareTarotCard(@Body() saveTarotCardDto: ShareTarotCardDto) {
    const shareCards =
      await this.tarotsService.shareTarotCard(saveTarotCardDto);
    return createResponse(200, 'Successful', shareCards);
  }
}
