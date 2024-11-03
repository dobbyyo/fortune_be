import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err) {
      console.error('Authentication Error:', err); // 에러 발생 시 로그 출력
    }
    if (!user) {
      console.error('No user found'); // 인증 실패 시 로그 출력
      throw new UnauthorizedException('Authentication failed'); // 예외 발생
    }
    return user; // 인증 성공 시 사용자 반환
  }
}
