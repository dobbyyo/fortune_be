# Production Dockerfile

# Node.js 18 버전의 경량화된 Alpine 이미지 사용
FROM node:18-alpine

ENV NODE_ENV=development

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 프로덕션 환경에서는 프로덕션 의존성만 설치
RUN npm install --only=production

# 소스 코드를 컨테이너로 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 8000번 포트 노출 (프로덕션에서는 80번 포트를 사용할 수 있도록 변경 가능)
EXPOSE 8000

# 빌드된 애플리케이션 실행
CMD ["node", "dist/main.js"]



