import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logger.interceptor';
import { LoggingMiddleware } from './middleware/logger.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './res/health/health.controller';
import { HealthModule } from './res/health/health.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // 설명: 환경변수를 캐싱할지 여부를 설정합니다. 기본값은 false입니다.
      isGlobal: true, // 설명: true로 설정하면 모듈이 전역으로 설정됩니다. 기본값은 false입니다.
      envFilePath: `.env.${process.env.NODE_ENV}`, // 설명: 환경변수 파일의 경로를 설정합니다.
      load: [appConfig, dbConfig],
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
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // 엔티티 경로 설정
        migrations: configService.get<string[]>('database.migrations'), // 마이그레이션 경로 설정
        migrationsTableName: configService.get<string>(
          'database.migrationsTableName',
        ), // 마이그레이션 테이블 이름 설정
      }),
    }),

    HealthModule,
    TerminusModule,
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
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
