import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@res/users/users.service';
import { RedisService } from '../redis/redis.service';
import { User, UserResponse } from './types/user.type';
import axios from 'axios';
import { ConfigType } from '@nestjs/config';
import kakaoConfig from '@/src/config/kakao.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @Inject(kakaoConfig.KEY) private config: ConfigType<typeof kakaoConfig>,
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
    avatar: string;
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
    await this.redisService.del(`refreshToken:${userId}`);
    return { message: 'successful' };
  }

  async getAccessToken(code: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('client_id', this.config.KAKAO_CLIENT_ID);
      params.append('redirect_uri', this.config.KAKAO_REDIRECT_URI);
      params.append('code', code);

      const response = await axios.post(this.config.KAKAO_TOKEN_URL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        '카카오 토큰 인증실패',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Kakao Access Token 요청 실패',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getKakaoUserInfo(accessToken: {
    access_token: string;
  }): Promise<any | null> {
    try {
      const res = await axios.get(this.config.KAKAO_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      return res.data;
    } catch (error) {
      console.error('Failed to fetch Kakao user info:', error.message);
      return null;
    }
  }

  async handleKakaoUser(kakaoUser: any) {
    const email = kakaoUser.kakao_account.email;
    const nickname = kakaoUser.properties.nickname;
    const avatar = kakaoUser.properties.profile_image;

    if (!email) {
      throw new Error('Email is required for login/signup');
    }

    // 사용자 존재 여부 확인
    const { myInfo } = await this.validateUserByEmail(email);

    if (myInfo) {
      return {
        userExist: true,
        email,
        nickname,
        avatar,
      };
    } else {
      // 회원가입 처리 정보 반환
      return {
        userExist: false,
        email,
        nickname,
        avatar,
      };
    }
  }

  async withdrawal(email: string, userId: number) {
    // Check if the user exists
    const user = await this.validateUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.deleteUser(userId);

    return { message: 'Successful' };
  }
}
