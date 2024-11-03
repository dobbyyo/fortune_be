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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'CSRF 토큰 발급' })
  @Get('csrf-token')
  async getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const csrfToken = req.csrfToken(); // CSRF 토큰 생성

    return res.status(200).json({ csrfToken });
  }

  @ApiOperation({ summary: 'Login' })
  @ApiHeader({
    name: 'csrf-token',
    description: 'CSRF token for secure requests',
    required: true,
  })
  @UseGuards(AuthenticatedGuard) // 로그인 상태에서는 접근 불가
  @Post('login')
  async login(
    @Headers('csrf-token') csrfToken: string, // 요청 헤더에서 CSRF 토큰을 가져옴
    @Body() loginemailDto: LoginEmailDto,
  ) {
    const user = await this.authService.validateUserByEmail(
      loginemailDto.email,
    );

    return this.authService.login(user);
  }

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 200, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: 'Fail' })
  @UseGuards(AuthenticatedGuard) // 로그인 상태에서는 접근 불가
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Headers('csrf-token') csrfToken: string,
    @Req() req: Request,
  ) {
    return this.authService.register(req.body);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @ApiResponse({ status: 400, description: 'Fail' })
  @Post('logout')
  async logout(@Req() req: Request) {
    return this.authService.logout((req.user as any).id);
  }
}
