import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@res/users/users.service';
import { RedisService } from '../redis/redis.service';
import { User, UserResponse } from './types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  private verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

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

    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.redisService.set(`token:${myInfo.id}`, accessToken, 7200);
    await this.redisService.set(
      `refreshToken:${myInfo.id}`,
      refreshToken,
      604800,
    ); // 7일

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string, userData: UserResponse) {
    const payload = this.verifyToken(refreshToken);

    const redisToken = await this.redisService.get(
      `refreshToken:${payload.userId}`,
    );
    if (!redisToken || redisToken !== refreshToken) {
      throw new UnauthorizedException('만료된 토큰이거나 잘못된 토큰입니다.');
    }

    const newAccessToken = this.jwtService.sign(
      {
        userId: userData.userId,
        email: userData.email,
        username: userData.username,
        gender: userData.gender,
        birth_date: userData.birth_date,
        birth_time: userData.birth_time,
        calendar_type: userData.calendar_type,
      },
      { expiresIn: '2h' },
    );

    return { newAccessToken };
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
