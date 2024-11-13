import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FortunesService } from '@res/fortunes/fortunes.service';
import { Request } from 'express';
import { GetTodayFortunesDto } from './dto/get-today-fortunes.dto';
import { createResponse } from '@/src/utils/create-response.util';

@ApiTags('fortunes')
@Controller('fortunes')
export class FortunesController {
  constructor(private readonly fortunesService: FortunesService) {}

  @AuthAndCsrfHeaders('운세 저장')
  @UseGuards(JwtAuthGuard)
  @Get('today')
  async getTodayFortunes(
    @Query() drawSandbarDto: GetTodayFortunesDto,
    @Req() req: Request,
  ) {
    const userData = req.user;

    if (Number(userData.userId) !== Number(drawSandbarDto.userId)) {
      return createResponse(400, 'error', '사용자 정보가 일치하지 않습니다');
    }

    const birthDate = userData.birth_date;
    const birthTime = userData.birth_time;

    const birthHour = parseInt(birthTime.split(':')[0]);
    const birthMinute = parseInt(birthTime.split(':')[1]);

    const sandbarData = await this.fortunesService.getTodayForunes(
      userData,
      birthDate,
      birthHour,
      birthMinute,
    );

    return createResponse(200, 'successful', sandbarData);
  }

  @AuthAndCsrfHeaders('운세 풀이')
  @UseGuards(JwtAuthGuard)
  @Get('explanation')
  async getExplanation(
    @Query() drawSandbarDto: GetTodayFortunesDto,
    @Req() req: Request,
  ) {
    const userData = req.user;
    const birthDate = userData.birth_date;
    const birthTime = userData.birth_time;

    const birthHour = parseInt(birthTime.split(':')[0]);
    const birthMinute = parseInt(birthTime.split(':')[1]);

    if (Number(userData.userId) !== Number(drawSandbarDto.userId)) {
      return createResponse(400, 'error', '사용자 정보가 일치하지 않습니다');
    }

    const explanationData =
      await this.fortunesService.getTodayForunesExplanation(
        userData,
        birthDate,
        birthHour,
        birthMinute,
      );

    return createResponse(200, 'successful', explanationData);
  }
}
