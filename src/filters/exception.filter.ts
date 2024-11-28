import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    this.logger.error(`Exception: ${exception}`);
    response.status(status).json({
      status: status,
      timestamp: new Date().toISOString(),
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      path: request.url,
    });
  }
}
