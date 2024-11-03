import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../res/auth/auth.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 로그인 상태 확인
    if (request.isAuthenticated && request.isAuthenticated()) {
      console.log('이미 로그인된 사용자입니다.');
      throw new UnauthorizedException('이미 로그인된 사용자입니다.');
    }

    // 이메일 유효성 확인 (로그인 로직에 필요한 경우)
    const { email } = request.body;
    const user = await this.authService.validateUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('해당 유저가 존재하지 않습니다.');
    }

    return true; // 비로그인 상태 및 유효한 사용자일 때만 접근 허용
  }
}
