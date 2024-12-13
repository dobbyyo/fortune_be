import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Passport의 세션 인증 확인
    if (request.isAuthenticated && request.isAuthenticated()) {
      throw new UnauthorizedException('이미 로그인된 사용자입니다.');
    }

    return true; // 비로그인 상태 및 유효한 사용자일 때만 접근 허용
  }
}
