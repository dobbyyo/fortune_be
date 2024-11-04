import appConfig from '@/src/config/app.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayloadType } from '@/src/types/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET,
      passReqToCallback: true, // info 객체 전달을 위한 옵션 설정
    });
  }

  async validate(req: Request, payload: JwtPayloadType) {
    console.log('payload:', payload);
    const token = req.get('authorization')?.replace('Bearer ', ''); // 헤더에서 토큰 추출
    console.log('token:', token);
    return { ...payload, token }; // 토큰을 포함한 유저 정보 반환
  }
}
