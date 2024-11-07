import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CsrfHeaders(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiHeader({
      name: 'csrf-token',
      description: 'CSRF token for secure requests',
      required: true,
    }),
    ApiResponse({ status: 200, description: 'successful' }),
    ApiResponse({ status: 400, description: 'Fail' }),
  );
}
