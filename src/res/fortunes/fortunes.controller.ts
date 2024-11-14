import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import {
  Body,
  Controller,
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
}

// {
//     "userId": 1,
//     "title": "오늘의 운세 저장",
//     "todaysFortune": {
//     "totalFortuneTitle": "총운",
//     "totalFortuneDescription": "오늘은 좋은 기운이 가득한 날입니다.",
//     "wealthFortuneTitle": "재물운",
//     "wealthFortuneDescription": "금전적인 운이 매우 좋은 날입니다.",
//     "loveFortuneTitle": "연애운",
//     "loveFortuneDescription": "애정운이 상승하며 좋은 인연을 만날 수 있습니다.",
//     "businessFortuneTitle": "사업운",
//     "businessFortuneDescription": "사업에 큰 기회를 얻을 수 있습니다.",
//     "healthFortuneTitle": "건강운",
//     "healthFortuneDescription": "건강에 특별히 문제가 없는 날입니다.",
//     "studyFortuneTitle": "학업운",
//     "studyFortuneDescription": "학업에 집중하기 좋은 날입니다.",
//     "luckyItemsTitle": "행운의 아이템",
//     "luckyItem1": "파란색 펜",
//     "luckyItem2": "녹색 노트",
//     "luckyOutfitTitle": "행운의 코디",
//     "luckyOutfitDescription": "편안한 옷차림이 행운을 불러옵니다.",
//   },
//     "zodiacFortune": {
//     "zodiacTitle": "소띠 운세",
//     "zodiacMainDescription": "성실한 성격 덕분에 안정적인 하루를 보낼 수 있습니다.",
//     "zodiacSubDescription": "작은 문제에도 대처할 수 있는 능력을 발휘하게 됩니다.",
//     "yearOfBirth": "1985",
//     "imageUrl": "https://example.com/zodiac/ox.jpg",
//   },
//   "starSignFortune": {
//     "starSign": "물병자리",
//     "starMainDescription": "혁신적인 생각이 빛나는 날입니다.",
//     "starSubDescription": "창의력이 발휘되는 상황에서 기회를 찾을 수 있습니다.",
//     "imageUrl": "https://example.com/star/aquarius.jpg",
//     "year": "1999",
//   },
// }
