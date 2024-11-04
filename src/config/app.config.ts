import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST || 'localhost',
  port: parseInt(process.env.APP_PORT, 10) || 8000,
  APP_SESSION_SECRET: process.env.APP_SESSION_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  HTTP_ONLY: process.env.HTTP_ONLY,
  SECURE: process.env.HTTP_SECURE,
  SAME_SITE: process.env.HTTP_SAME_SITE,
}));
