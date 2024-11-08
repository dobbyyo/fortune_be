import { registerAs } from '@nestjs/config';

export const openaiConfig = registerAs('openai', () => ({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}));
