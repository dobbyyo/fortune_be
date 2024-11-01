import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisService } from './res/redis/redis.service';
import { AuthModule } from './res/auth/auth.module';

console.log('asd', __dirname);
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // 설명: 환경변수를 캐싱할지 여부를 설정합니다. 기본값은 false입니다.
      isGlobal: true, // 설명: true로 설정하면 모듈이 전역으로 설정됩니다. 기본값은 false입니다.
      envFilePath: `.env.${process.env.NODE_ENV}`, // 설명: 환경변수 파일의 경로를 설정합니다.
      load: [appConfig, dbConfig],
    }),

    ThrottlerModule.forRoot([
      // 설명: 요청 제한을 설정합니다.
      {
        ttl: 60, // 설명: 요청 제한 시간(초)을 설정합니다. 기본값은 60초입니다.
        limit: 10, // 설명: 요청 제한 횟수를 설정합니다. 기본값은 10입니다.
      },
    ]),

    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),

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
        entities: [__dirname + '/res/**/entities/*.entity{.ts,.js}'], // 엔티티 경로 설정
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
  ],

  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    RedisService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
