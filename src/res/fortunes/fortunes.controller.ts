import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
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
import * as dayjs from 'dayjs';
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

    if (!birthTime || !birthTime.includes(':')) {
      throw new BadRequestException('유효한 생년월일 및 시간을 제공해주세요.');
    }

    // 1. birthDate와 birthTime을 합쳐 Date 객체 생성
    const combinedDateTime = dayjs(`${birthDate} ${birthTime}`).toDate();

    // 2. -32분 조정
    const adjustedDateTime = dayjs(combinedDateTime)
      .subtract(32, 'minute')
      .toDate();

    // 3. 조정된 Date 객체를 다시 날짜와 시간으로 분리
    const adjustedBirthDate = dayjs(adjustedDateTime).format('YYYY-MM-DD');
    const adjustedBirthTime = dayjs(adjustedDateTime).format('HH:mm:ss');

    console.log('adjustedBirthDate', adjustedBirthDate);
    console.log('adjustedBirthTime', adjustedBirthTime);

    const [birthHour, birthMinute] = adjustedBirthTime.split(':').map(Number);

    const sandbarData = await this.fortunesService.getTodayFortunes(
      userData,
      adjustedBirthDate,
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
      await this.fortunesService.getTodayFortunesExplanation(
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
