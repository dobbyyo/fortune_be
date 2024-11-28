import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '@res/users/users.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    const myEmail = req.user.email;
    const updateUser = await this.usersService.updateLanguage(
      myEmail,
      updateLanguageDto,
    );
    return createResponse(200, 'successful', updateUser);
  }
}
