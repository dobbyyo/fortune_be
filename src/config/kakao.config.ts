import { registerAs } from '@nestjs/config';

export default registerAs('kakao', () => ({
  KAKAO_TOKEN_URL: process.env.KAKAO_TOKEN_URL,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
  KAKAO_USER_INFO_URL: process.env.KAKAO_USER_INFO_URL,
}));
