import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function AuthAndCsrfHeaders(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiHeader({
      name: 'Authorization',
      description: 'Bearer access token for authentication',
      required: true,
    }),
    ApiHeader({
      name: 'csrf-token',
      description: 'CSRF token for secure requests',
      required: true,
    }),
    ApiResponse({ status: 200, description: 'successful' }),
    ApiResponse({ status: 400, description: 'Fail' }),
  );
}
