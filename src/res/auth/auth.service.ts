import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@res/users/users.service';
import { RedisService } from '../redis/redis.service';
import { User } from './types/user.type';

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
      throw new UnauthorizedException('해당 유저가 존재하지 않습니다.');
    }

    return user;
  }

  async login(user: User) {
    const { myInfo } = user;

    const payload = {
      userId: myInfo.id,
      email: myInfo.email,
      username: myInfo.username,
      gender: myInfo.gender,
      birth_date: myInfo.birth_date,
      birth_time: myInfo.birth_time,
      calendar_type: myInfo.calendar_type,
    };

    const token = this.jwtService.sign(payload);

    await this.redisService.set(`token:${myInfo.id}`, token, 7200);
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
    const { myInfo } = await this.usersService.findByEmail(user.email);

    if (myInfo) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    await this.usersService.createUser(user);

    return { message: 'successful' };
  }

  async logout(userId: number) {
    await this.redisService.del(`token:${userId}`);

    return { message: 'successful' };
  }
}
