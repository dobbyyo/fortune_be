import { Controller, Req, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from '@/src/guards/local-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 200, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: 'Fail' })
  @Post('register')
  async register(@Req() req: Request) {
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
