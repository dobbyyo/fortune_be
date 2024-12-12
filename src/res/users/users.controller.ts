import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '@res/users/users.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { MybookmarkFortuneDto } from './dto/mybookmark-fortune.dto';
import { MybookmarkTarotsDto } from './dto/mybookmark-tarots.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthAndCsrfHeaders('북마크 타로카드 상세정보 가져오기')
  @UseGuards(JwtAuthGuard)
  @Get('myBookmarks/tarotCardDetails')
  async getMyBookmarksTarotCardDetails(
    @Req() req: Request,
    @Query() payload: MybookmarkTarotsDto,
  ) {
    const userData = req.user;
    if (Number(userData.userId) !== Number(payload.userId)) {
      throw new BadRequestException('사용자 정보가 일치하지 않습니다');
    }

    const email = req.user.email;

    const myBookmarksTarotCardDetails =
      await this.usersService.getMyBookmarksTarotCardDetails(
        email,
        payload.tarotCardId,
      );

    return createResponse(200, 'successful', myBookmarksTarotCardDetails);
  }

  @AuthAndCsrfHeaders('북마크 오늘의 운세 상세정보 가져오기')
  @UseGuards(JwtAuthGuard)
  @Get('myBookmarks/fortuneDetails')
  async getMyBookmarksFortuneDetails(
    @Req() req: Request,
    @Query() payload: MybookmarkFortuneDto,
  ) {
    const userData = req.user;
    if (Number(userData.userId) !== Number(payload.userId)) {
      throw new BadRequestException('사용자 정보가 일치하지 않습니다');
    }

    const email = req.user.email;

    const myBookmarksFortuneDetails =
      await this.usersService.getMyBookmarksFortuneDetails(
        email,
        payload.fortuneId,
        payload.zodiacId,
        payload.startId,
      );

    return createResponse(200, 'successful', myBookmarksFortuneDetails);
  }

  @AuthAndCsrfHeaders('나의 정보 가져오기')
  @UseGuards(JwtAuthGuard)
  @Get('myInfo')
  async getMyInfo(@Req() req: Request) {
    const email = req.user.email;
    const user = await this.usersService.findByEmail(email);

    return createResponse(200, 'successful', user);
  }

  @AuthAndCsrfHeaders('나의 정보 수정하기')
  @UseGuards(JwtAuthGuard)
  @Patch('updateMyInfo')
  async updateMyInfo(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userData = req.user;

    if (Number(userData.userId) !== Number(updateUserDto.userId)) {
      throw new BadRequestException('사용자 정보가 일치하지 않습니다');
    }

    const myEmail = req.user.email;
    const updateUser = await this.usersService.updateMyInfo(
      myEmail,
      updateUserDto,
    );
    return createResponse(200, 'successful', updateUser);
  }

  @AuthAndCsrfHeaders('언어 설정 변경하기')
  @UseGuards(JwtAuthGuard)
  @Patch('updateLanguage')
  async updateLanguage(
    @Req() req: Request,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    const userData = req.user;

    if (Number(userData.userId) !== Number(updateLanguageDto.userId)) {
      throw new BadRequestException('사용자 정보가 일치하지 않습니다');
    }

    const myEmail = req.user.email;
    const updateUser = await this.usersService.updateLanguage(
      myEmail,
      updateLanguageDto,
    );
    return createResponse(200, 'successful', updateUser);
  }

  @AuthAndCsrfHeaders('나의 북마크 가져오기')
  @UseGuards(JwtAuthGuard)
  @Get('myBookmarks/:userId')
  async getMyBookmarks(@Req() req: Request, @Param('userId') userId: number) {
    {
      const userData = req.user;
      if (Number(userData.userId) !== Number(userId)) {
        throw new BadRequestException('사용자 정보가 일치하지 않습니다');
      }

      const email = req.user.email;

      const myBookmarks = await this.usersService.getMyBookmarks(email);

      return createResponse(200, 'successful', myBookmarks);
    }
  }

  @AuthAndCsrfHeaders('북마크 꿈 해몽 상세정보 가져오기')
  @UseGuards(JwtAuthGuard)
  @Get('myBookmarks/dreamDetails/:userId')
  async getMyBookmarksDreamDetails(
    @Req() req: Request,
    @Param('userId') userId: number,
  ) {
    const userData = req.user;
    if (Number(userData.userId) !== Number(userId)) {
      throw new BadRequestException('사용자 정보가 일치하지 않습니다');
    }

    const email = req.user.email;

    const myBookmarksDreamDetails =
      await this.usersService.getMyBookmarksDreamDetails(email);

    return createResponse(200, 'successful', myBookmarksDreamDetails);
  }

  @AuthAndCsrfHeaders('북마크 작명 상세정보 가져오기')
  @UseGuards(JwtAuthGuard)
  @Get('myBookmarks/namingDetails/:userId')
  async getMyBookmarksNamingDetails(
    @Req() req: Request,
    @Param('userId') userId: number,
  ) {
    const userData = req.user;
    if (Number(userData.userId) !== Number(userId)) {
      throw new BadRequestException('사용자 정보가 일치하지 않습니다');
    }

    const email = req.user.email;

    const myBookmarksNamingDetails =
      await this.usersService.getMyBookmarksNamingDetails(email);

    return createResponse(200, 'successful', myBookmarksNamingDetails);
  }
}
