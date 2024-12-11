import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      // 인증 실패 시, `user`를 null로 설정하고 요청을 계속 진행
      return null;
    }
    return user;
  }
}
