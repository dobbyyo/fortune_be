import {
  Controller,
  Req,
  Post,
  Get,
  Res,
  Body,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginEmailDto } from './dto/login-email.dto';
import { AuthenticatedGuard } from '@/src/guards/authenticated.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { createResponse } from '@/src/utils/create-response.util';

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

    return res
      .status(200)
      .json(createResponse(200, 'successful', { csrfToken }));
  }

  @ApiOperation({ summary: 'Login' })
  @ApiHeader({
    name: 'csrf-token',
    description: 'CSRF token for secure requests',
    required: true,
  })
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
    const access_token = await this.authService.login(user);

    res.cookie('access_token', access_token, {
      httpOnly: this.configService.get<boolean>('app.HTTP_ONLY'),
      secure: this.configService.get<boolean>('app.SECURE'),
      sameSite:
        this.configService.get<'lax' | 'strict' | 'none'>('app.SAME_SITE') ||
        'lax',
    });

    return res
      .status(200)
      .json(createResponse(200, 'successful', access_token));
  }

  @ApiOperation({ summary: '회원가입' })
  @ApiHeader({
    name: 'csrf-token',
    description: 'CSRF token for secure requests',
    required: true,
  })
  @ApiResponse({ status: 200, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: 'Fail' })
  @UseGuards(AuthenticatedGuard)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Headers('csrf-token') csrfToken: string,
    @Req() req: Request,
  ) {
    await this.authService.register(req.body);
    return createResponse(200, 'successful');
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token for authentication',
    required: true,
  })
  @ApiHeader({
    name: 'csrf-token',
    description: 'CSRF token for secure requests',
    required: true,
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @ApiResponse({ status: 400, description: 'Fail' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Headers('csrf-token') csrfToken: string,
    @Headers('authorization') authorization: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
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
}
