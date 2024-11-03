import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UsersModule, PassportModule.register({ defaultStrategy: 'local' })],
  controllers: [AuthController],
  providers: [AuthService, JwtService, RedisService], // AuthService, JwtService, RedisService를 providers에 추가 (의존성 주입)
  exports: [AuthService], // AuthService를 외부에서 사용할 수 있도록 설정
})
export class AuthModule {}
