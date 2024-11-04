import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('app.JWT_SECRET');
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '2h' },
        };
      },
    }),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RedisService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule], // AuthService를 외부에서 사용할 수 있도록 설정
})
export class AuthModule {}
