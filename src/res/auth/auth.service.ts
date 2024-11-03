import { Injectable } from '@nestjs/common';
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
    console.log('email', email);
    const user = await this.usersService.findByEmail(email);
    console.log('user', user);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    console.log('user', user);
    const payload = { email: user.email, sub: user.id };
    console.log('payload', payload);
    const token = this.jwtService.sign(payload);

    // Redis에 토큰 저장 (유효기간 설정 가능)
    await this.redisService.set(`token:${user.id}`, token, 3600); // 1시간 유효
    return { access_token: token };
  }

  async register(user: any) {
    return this.usersService.createUser(user);
  }

  async logout(userId: number) {
    // Redis에서 토큰 삭제
    await this.redisService.del(`token:${userId}`);
    return { message: 'Logout success' };
  }
}
