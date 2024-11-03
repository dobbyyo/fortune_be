import { NestFactory } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from '@src/app.module';
import appConfig from '@src/config/app.config';
import { winstonLogger } from '@src/utils/logger.util';
import { CustomValidationPipe } from '@src/pipe/validation.pipe';
import { AllExceptionsFilter } from './filters/exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(winstonLogger);

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  console.log('config', config.APP_SESSION_SECRET);
  // 세션 미들웨어 설정

  app.use(helmet()); // 보안을 위한 헤더 설정
  // app.use(cookieParser()); // 쿠키 파서 미들웨어 등록

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
