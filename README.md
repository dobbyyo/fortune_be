### Nest.js에서의 전체적인 흐믊

- 요청 → 미들웨어 → 가드 → 인터셉터 → 파이프 → 컨트롤러 → 서비스 → 예외 발생 시 필터

### Docker를 이용한 서버 실행 방법

- Docker 이미지 생성 (Build)
  - docker build -f Dockerfile.dev -t fortune_be:dev .
- 이미지 목록 확인
  - docker images
- 컨테이너 실행
  - docker run --env-file .env.development -p 8000:8000 -v $(pwd):/usr/src/app --name fortune-dev fortune_be:dev

### 적용 설정

- @nestjs/config (ConfigType 사용)
- cookie-parser
- winston logger (interceptor, middleware)
- CORS 설정을 통해 클라이언트에서 서버에 접근할 수 있도록 허용.
- 환경 구분을 통해 개발, 프로덕션, 테스트 환경을 분리.
- ValidationPipe를 사용하여 요청 데이터의 유효성을 검사.
- Swagger를 사용해 API 문서를 자동으로 생성.
- Helmet과 Rate Limiting으로 보안 설정 강화.
- CSRF 보호
- Health Check 상태 관리.
