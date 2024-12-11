import {
  Controller,
  Req,
  Post,
  Get,
  Res,
  Body,
  Headers,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginEmailDto } from './dto/login-email.dto';
import { AuthenticatedGuard } from '@/src/guards/authenticated.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { createResponse } from '@/src/utils/create-response.util';
import { AuthAndCsrfHeaders } from '@/src/utils/auth-csrf-headers.util';
import { CsrfHeaders } from '@/src/utils/csrf-headers.util';
import { OptionalJwtAuthGuard } from '@/src/guards/option-jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'CSRF 토큰 발급' })
  @Get('csrf-token')
  async getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const csrfToken = req.csrfToken(); // CSRF 토큰 생성
    res.cookie('csrf-token', csrfToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      // this.configService.get<'lax' | 'strict' | 'none'>('app.SAME_SITE') ||
      // 'lax',
    });

    return res
      .status(200)
      .json(createResponse(200, 'successful', { csrfToken }));
  }

  @CsrfHeaders('로그인')
  @UseGuards(AuthenticatedGuard)
  @Post('login')
  async login(
    @Headers('csrf-token') csrfToken: string,
    @Res() res: Response,
    @Body() loginemailDto: LoginEmailDto,
  ) {
    const user = await this.authService.validateUserByEmail(
      loginemailDto.email,
    );
    const myInfo = user.myInfo;
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('access_token', accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      // httpOnly: this.configService.get<boolean>('app.HTTP_ONLY'),
      // secure: this.configService.get<boolean>('app.SECURE'),
      // sameSite:
      //   this.configService.get<'lax' | 'strict' | 'none'>('app.SAME_SITE') ||
      //   'lax',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      // httpOnly: this.configService.get<boolean>('app.HTTP_ONLY'),
      // secure: this.configService.get<boolean>('app.SECURE'),
      // sameSite:
      //   this.configService.get<'lax' | 'strict' | 'none'>('app.SAME_SITE') ||
      //   'lax',
    });

    return res.status(200).json(
      createResponse(200, 'successful', {
        accessToken,
        refreshToken,
        myInfo,
      }),
    );
  }

  @AuthAndCsrfHeaders('리프레시 토큰으로 엑세스 토큰 재발급')
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const userData = req.user;
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken)
      throw new UnauthorizedException('refreshToken이 존재하지 않습니다.');

    const { newAccessToken } = await this.authService.refreshAccessToken(
      refreshToken,
      userData,
    );

    res.cookie('access_token', newAccessToken, {
      httpOnly: this.configService.get<boolean>('app.HTTP_ONLY'),
      secure: this.configService.get<boolean>('app.SECURE'),
      sameSite:
        this.configService.get<'lax' | 'strict' | 'none'>('app.SAME_SITE') ||
        'lax',
    });

    res.send({ message: 'Token refreshed' });
  }

  @CsrfHeaders('회원가입')
  @UseGuards(AuthenticatedGuard)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return createResponse(200, 'successful');
  }

  @AuthAndCsrfHeaders('로그아웃')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('logout userId:', (req.user as any).userId);

    await this.authService.logout((req.user as any).userId);

    // 쿠키에서 access_token 삭제
    res.clearCookie('access_token', {
      httpOnly: this.configService.get<boolean>('app.HTTP_ONLY'),
      secure: this.configService.get<boolean>('app.SECURE'),
      sameSite:
        this.configService.get<'lax' | 'strict' | 'none'>('app.SAME_SITE') ||
        'lax',
    });

    return res.status(200).json(createResponse(200, 'successful'));
  }

  @CsrfHeaders('유저 존재 여부 확인')
  @Get('kakao/callback')
  async kakaoCallback(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('successful');
    }

    // 1. 카카오로부터 액세스 토큰 받기
    const accessToken = await this.authService.getAccessToken(code);
    if (!accessToken) {
      throw new BadRequestException('successful');
    }

    // 2. 액세스 토큰으로 사용자 정보 가져오기
    const kakaoUser = await this.authService.getKakaoUserInfo(accessToken);

    if (!kakaoUser) {
      throw new BadRequestException('not found kakao user');
    }

    // 3. 사용자 존재 여부 확인 및 처리
    const result = await this.authService.handleKakaoUser(kakaoUser);

    // 4. 응답 생성
    return createResponse(200, 'successful', result);
  }

  //로그인 여부
  @AuthAndCsrfHeaders('로그인 유무 체크')
  @UseGuards(OptionalJwtAuthGuard)
  @Get('check')
  async check(@Req() req: Request) {
    const user = req.user;
    if (!user) {
      console.log('실행2');
      return createResponse(401, 'unauthorized');
    }

    console.log('실행', user);
    return createResponse(200, 'successful');
  }
}
