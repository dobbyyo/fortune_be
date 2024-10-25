import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from '@/src/utils/logger.util';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const ip =
      req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress; // IP 주소 수집
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      winstonLogger.info(
        `[Middleware] ${method} ${url} ${status} - ${duration}ms - IP: ${ip}`,
      );
    });

    next();
  }
}
