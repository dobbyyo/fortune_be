import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DreamsService } from '@res/dreams/dreams.service';
import { InterpretDreamDto } from './dto/interpret-dream.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { SaveInterpretedDreamDto } from './dto/save-interpreted-dream.dto';

@ApiTags('Dreams')
@Controller('dreams')
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}

  @CsrfHeaders('꿈 해몽')
  @Post('interpret')
  async interpretDream(@Body() interpretDreamDto: InterpretDreamDto) {
    const { title, description } = interpretDreamDto;
    const decodedTitle = decodeURIComponent(title); // 한글 디코딩
    const decodedDescription = decodeURIComponent(description); // 한글 디코딩

    const interpretation = await this.dreamsService.interpretDream(
      decodedTitle,
      decodedDescription,
    );

    return createResponse(200, 'successful', interpretation);
  }

  @AuthAndCsrfHeaders('꿈 해몽 저장')
  @UseGuards(JwtAuthGuard)
  @Post('save')
  async saveInterpretedDream(
    @Req() req: Request,
    @Body() saveInterpretedDreamDto: SaveInterpretedDreamDto,
  ) {
    const { userId } = req.user;
    const { mainTitle, user_description, ai_interpretation } =
      saveInterpretedDreamDto;
    const dreamSave = await this.dreamsService.saveInterpretedDream(
      userId,
      mainTitle,
      user_description,
      ai_interpretation,
    );

    return createResponse(200, 'successful', dreamSave);
  }

  @AuthAndCsrfHeaders('꿈 해몽 저장 취소')
  @UseGuards(JwtAuthGuard)
  @Delete('cancel/:savedDreamInterpretationId')
  async cancelSavedDreamInterpretation(
    @Req() req: Request,
    @Query('savedDreamInterpretationId') savedDreamInterpretationId: number,
  ) {
    const { userId } = req.user;
    await this.dreamsService.cancelSavedDreamInterpretation(
      userId,
      savedDreamInterpretationId,
    );

    return createResponse(200, 'successful');
  }
}
