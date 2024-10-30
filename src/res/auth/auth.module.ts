import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, RedisService],
  exports: [AuthService], // AuthService를 외부에서 사용할 수 있도록 설정
})
export class AuthModule {}
