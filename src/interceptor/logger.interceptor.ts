import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { winstonLogger } from '@/src/utils/logger.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const ip =
      request.headers['x-forwarded-for'] ||
      request.ip ||
      request.connection.remoteAddress;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const status = response.statusCode;
        const duration = Date.now() - now;
        winstonLogger.info(
          `[Interceptor] ${method} ${url} ${status} - ${duration}ms - IP: ${ip}`,
        );
      }),
    );
  }
}
