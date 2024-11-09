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
import { NamingsService } from '@res/namings/namings.service';
import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import { DrawNamingDto } from './dto/draw-naming.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { ApiTags } from '@nestjs/swagger';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import { Request } from 'express';
import { SaveNamingDto } from './dto/save-naming.dto';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';

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

  @AuthAndCsrfHeaders('작명 저장')
  @UseGuards(JwtAuthGuard)
  @Post('save')
  async saveNaming(@Req() req: Request, @Body() saveNamingDto: SaveNamingDto) {
    const { userId } = req.user;
    const { mainTitle, namings } = saveNamingDto;
    await this.namingsService.saveNaming(userId, mainTitle, namings);
    return createResponse(200, 'successful');
  }

  @AuthAndCsrfHeaders('작명 취소')
  @UseGuards(JwtAuthGuard)
  @Delete('cancel/:savedNamingId')
  async cancelSavedNaming(
    @Req() req: Request,
    @Param('savedNamingId') savedNamingId: number,
  ) {
    const { userId } = req.user;
    await this.namingsService.cancelSavedNaming(userId, savedNamingId);
    return createResponse(200, 'successful');
  }
}
