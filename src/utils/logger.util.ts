import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';
const logDir = __dirname + '/../../logs';

// NestJS에서 사용하는 레벨을 포함한 커스텀 레벨 설정
const levels = {
  error: 0,
  debug: 1,
  warn: 2,
  info: 3,
  data: 4,
  verbose: 5,
  silly: 6,
  custom: 7,
};

// 날짜별 파일 옵션 설정
const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%-${level}.log`,
    zippedArchive: true, // 압축 여부
    maxSize: '20m', // 파일 최대 크기
    maxFiles: '14d', // 보관 기간
  };
};

export const winstonLogger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'silly',
      format: isProduction
        ? winston.format.simple() // 배포 환경인 경우 간단한 형식으로 출력
        : winston.format.combine(
            // 개발 환경인 경우 다음과 같은 형식으로 출력
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              // nest-winston 모듈의 nestLike 메서드를 사용하여 로그 형식을 지정합니다.
              colors: true, // 색상 출력 여부
              prettyPrint: true, // JSON 형식으로 출력 여부
            }),
          ),
    }),
    new winstonDaily(dailyOptions('info')), // info 레벨 로그를 날짜별로 파일로 저장
    new winstonDaily(dailyOptions('warn')), // warn 레벨 로그를 날짜별로 파일로 저장
    new winstonDaily(dailyOptions('error')), // error 레벨 로그를 날짜별로 파일로 저장
  ],
});
