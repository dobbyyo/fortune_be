import { NestFactory } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as session from 'express-session';
import { doubleCsrf } from 'csrf-csrf';

import { AppModule } from '@src/app.module';
import appConfig from '@src/config/app.config';
import { winstonLogger } from '@src/utils/logger.util';
import { CustomValidationPipe } from '@src/pipe/validation.pipe';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(winstonLogger);

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  // 세션 미들웨어 설정
  app.use(
    session({
      secret: config.APP_SESSION_SECRET, // 세션을 암호화하기 위한 키
      resave: false, // 세션을 항상 저장할지 여부를 설정합니다. 기본값은 true입니다.
      saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부를 설정합니다. 기본값은 true입니다.
    }),
  );

  app.use(helmet()); // 보안을 위한 헤더 설정
  app.use(cookieParser()); // 쿠키 파서 미들웨어 등록

  // doubleCsrf 설정
  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: (req) => req.cookies['X-CSRF-Token'], // CSRF 토큰을 쿠키에서 가져옴
    cookieName: 'X-CSRF-Token', // 쿠키 이름 설정
    size: 64, // 토큰의 크기
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // 보호하지 않을 메서드
  });

  // CSRF 보호 미들웨어 적용
  app.use(doubleCsrfProtection);

  app.useGlobalPipes(new CustomValidationPipe()); // 전역 유효성 검사 파이프 등록
  app.enableCors({
    origin: '*', // 설명: 허용할 오리진을 설정합니다. 기본값은 '*'입니다.
    credentials: true, // 설명: 자격 증명을 허용할지 여부를 설정합니다. 기본값은 false입니다.
  });
  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FORTUNE API')
    .setDescription('FORTUNE API 문서입니다.')
    .setVersion('1.0')
    .addTag('FORTUNE')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
