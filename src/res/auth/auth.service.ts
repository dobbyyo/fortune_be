import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@res/users/users.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateUserByEmail(email: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('해당 유저가 존재하지 않습니다.'); // 에러 발생    ;
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const token = this.jwtService.sign(payload);

    // Redis에 토큰 저장 (유효기간 설정 가능)
    await this.redisService.set(`token:${user.id}`, token, 3600); // 1시간 유효
    return { access_token: token };
  }

  async register(user: {
    username: string;
    provider: string;
    email: string;
    gender: string;
    birth_date: Date;
    birth_time: string;
  }) {
    const existingUser = await this.usersService.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    return this.usersService.createUser(user);
  }

  async logout(userId: number) {
    // Redis에서 토큰 삭제
    await this.redisService.del(`token:${userId}`);
    return { message: 'Logout success' };
  }
}
