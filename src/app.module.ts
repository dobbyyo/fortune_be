import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { AppService } from '@src/app.service';
import appConfig from '@src/config/app.config';
import dbConfig from '@src/config/db.config';
import { LoggingInterceptor } from '@src/interceptor/logger.interceptor';
import { LoggingMiddleware } from '@src/middleware/logger.middleware';
import { HealthController } from '@res/health/health.controller';
import { HealthModule } from '@res/health/health.module';
import { UsersModule } from '@res/users/users.module';
import { AppController } from '@src/app.controller';
import { TarotsModule } from '@res/tarots/tarots.module';
import { FortunesModule } from '@res/fortunes/fortunes.module';
import { DreamsModule } from '@res/dreams/dreams.module';
import { NamingsModule } from '@res/namings/namings.module';
import { AuthModule } from './res/auth/auth.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { UsersEntity } from './res/users/entities/users.entity';
import { UsersProfileEntity } from './res/users/entities/users_profile.entity';
import { UsersPasswordEntity } from './res/users/entities/users_password.entity';
import { UsersNotificationEntity } from './res/users/entities/users_notification.entity';
import { UsersLanguageEntity } from './res/users/entities/users_language.entity';
import { TarotCardsEntity } from './res/tarots/entities/tarot_cards.entity';
import { SavedUserTarotCardsEntity } from './res/tarots/entities/saved_user_tarot_cards.entity';
import { SavedNamingEntity } from './res/namings/entities/saved_naming.entity';
import { NamingEntity } from './res/namings/entities/naming.entity';
import { ZodiacFortuneEntity } from './res/fortunes/entities/zodiac_fortune.entity';
import { StarSignFortuneEntity } from './res/fortunes/entities/star_sign_fortune.entity';
import { SavedSandbarsEntity } from './res/fortunes/entities/saved_sandbars.entity';
import { SandbarEntity } from './res/fortunes/entities/sandbar.entity';
import { HeavenlyStemsEntity } from './res/fortunes/entities/heavenly_stems.entity';
import { EarthlyBranchesEntity } from './res/fortunes/entities/earthly_baranches.entity';
import { SavedDreamInterpretationEntity } from './res/dreams/entities/saved_dream_interpretation.entity';
import awsConfig from './config/aws.config';
import redisConfig from './config/redis.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // 설명: 환경변수를 캐싱할지 여부를 설정합니다. 기본값은 false입니다.
      isGlobal: true, // 설명: true로 설정하면 모듈이 전역으로 설정됩니다. 기본값은 false입니다.
      envFilePath: `.env.${process.env.NODE_ENV}`, // 설명: 환경변수 파일의 경로를 설정합니다.
      load: [appConfig, dbConfig, awsConfig, redisConfig],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60, // 설명: 요청 제한 시간(초)을 설정합니다. 기본값은 60초입니다.
        limit: 10, // 설명: 요청 제한 횟수를 설정합니다. 기본값은 10입니다.
      },
    ]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),

        entities: [
          UsersEntity,
          UsersProfileEntity,
          UsersPasswordEntity,
          UsersNotificationEntity,
          UsersLanguageEntity,
          TarotCardsEntity,
          SavedUserTarotCardsEntity,
          SavedNamingEntity,
          NamingEntity,
          ZodiacFortuneEntity,
          StarSignFortuneEntity,
          SavedSandbarsEntity,
          SandbarEntity,
          HeavenlyStemsEntity,
          EarthlyBranchesEntity,
          SavedDreamInterpretationEntity,
        ], // 엔티티 경로 설정
        migrations: configService.get<string[]>('database.migrations'), // 마이그레이션 경로 설정
        migrationsTableName: configService.get<string>(
          'database.migrationsTableName',
        ), // 마이그레이션 테이블 이름 설정
      }),
    }),

    HealthModule,
    TerminusModule,
    UsersModule,
    TarotsModule,
    FortunesModule,
    DreamsModule,
    NamingsModule,
    AuthModule,
    RedisModule,
  ],

  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes('*')
      .apply(LoggingMiddleware)
      .forRoutes('*')
      .apply(
        csurf({
          cookie: {
            key: '_csrf', // CSRF 토큰을 저장할 쿠키 이름
            path: '/', // CSRF 토큰을 저장할 경로
            httpOnly: false, // 클라이언트에서 쿠키를 확인하지 못하도록 설정 개발 환경에서는 false로 설정
            secure: process.env.NODE_ENV === 'production', // HTTPS 환경에서만 사용
            sameSite: 'lax', // CSRF 공격 방어를 위한 설정 (strict, lax, none)
            maxAge: 24 * 60 * 60 * 1000, // CSRF 토큰의 유효 시간 (초 단위)
          },
        }),
      )
      .exclude({ path: '/api/auth/csrf-token', method: RequestMethod.GET }) // CSRF 토큰을 발급하는 라우트를 제외합니다.
      .forRoutes('*');
  }
}
