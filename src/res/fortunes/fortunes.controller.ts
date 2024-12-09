import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import {
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
import { FortunesService } from '@res/fortunes/fortunes.service';
import { Request } from 'express';
import { GetTodayFortunesDto } from './dto/get-today-fortunes.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { SaveSandbarDto } from './dto/save-today-fortunes.dto';
import { DeleteSandbarDto } from './dto/delete-sandbar.dto';

@ApiTags('fortunes')
@Controller('fortunes')
export class FortunesController {
  constructor(private readonly fortunesService: FortunesService) {}

  @AuthAndCsrfHeaders('오늘의 운세 뽑기')
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

  @AuthAndCsrfHeaders('띠 운세')
  @UseGuards(JwtAuthGuard)
  @Get('zodiac')
  async getZodiacFortunes(
    @Query() drawSandbarDto: GetTodayFortunesDto,
    @Req() req: Request,
  ) {
    const userData = req.user;
    const birthDate = userData.birth_date;

    if (Number(userData.userId) !== Number(drawSandbarDto.userId)) {
      return createResponse(400, 'error', '사용자 정보가 일치하지 않습니다');
    }

    const zodiacData = await this.fortunesService.getZodiacFortunes(birthDate);

    return createResponse(200, 'successful', zodiacData);
  }

  @AuthAndCsrfHeaders('별자리 운세')
  @UseGuards(JwtAuthGuard)
  @Get('constellation')
  async getConstellationFortunes(
    @Query() drawSandbarDto: GetTodayFortunesDto,
    @Req() req: Request,
  ) {
    const userData = req.user;
    const birthDate = userData.birth_date;

    if (Number(userData.userId) !== Number(drawSandbarDto.userId)) {
      return createResponse(400, 'error', '사용자 정보가 일치하지 않습니다');
    }

    const constellationData =
      await this.fortunesService.getConstellationFortunes(birthDate);

    return createResponse(200, 'successful', constellationData);
  }

  @AuthAndCsrfHeaders('사주 저장')
  @UseGuards(JwtAuthGuard)
  @Post('save')
  async saveFortunes(
    @Body() saveSandbarDto: SaveSandbarDto,
    @Req() req: Request,
  ) {
    const userData = req.user;

    if (Number(userData.userId) !== Number(saveSandbarDto.userId)) {
      return createResponse(400, 'error', '사용자 정보가 일치하지 않습니다');
    }

    const savedFortune =
      await this.fortunesService.saveFortunes(saveSandbarDto);
    return createResponse(200, 'successful', savedFortune);
  }

  @AuthAndCsrfHeaders('사주 저장 취소')
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteSandbar(
    @Query() deleteSandbarDto: DeleteSandbarDto,
    @Req() req: Request,
  ) {
    const userData = req.user;

    if (Number(userData.userId) !== Number(deleteSandbarDto.userId)) {
      return createResponse(400, 'error', '사용자 정보가 일치하지 않습니다');
    }

    const deletedFortune =
      await this.fortunesService.deleteSandbar(deleteSandbarDto);
    return createResponse(200, 'successful', deletedFortune);
  }
}
