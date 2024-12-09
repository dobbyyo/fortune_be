import { NestFactory } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from '@src/app.module';
import appConfig from '@src/config/app.config';
import { winstonLogger } from '@src/utils/logger.util';
import { CustomValidationPipe } from '@src/pipe/validation.pipe';
import { AllExceptionsFilter } from './filters/exception.filter';
import * as express from 'express';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(winstonLogger);

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  app.use(helmet()); // 보안을 위한 헤더 설정
  app.use(express.urlencoded({ extended: true })); // body-parser 설정

  app.useGlobalPipes(new CustomValidationPipe()); // 전역 유효성 검사 파이프 등록
  app.enableCors({
    origin: '*', // 설명: 허용할 오리진을 설정합니다. 기본값은 '*'입니다.
    credentials: true, // 설명: 자격 증명을 허용할지 여부를 설정합니다. 기본값은 false입니다.
  });
  app.use(helmet());

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FORTUNE API')
    .setDescription('FORTUNE API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth() // Bearer Auth 설정
    .addTag('FORTUNE')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port, '0.0.0.0');
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
