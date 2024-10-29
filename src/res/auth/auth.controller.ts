import { Controller, Req, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from '@/src/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Req() req: Request) {
    return this.authService.register(req.body);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    return this.authService.logout((req.user as any).id);
  }
}
