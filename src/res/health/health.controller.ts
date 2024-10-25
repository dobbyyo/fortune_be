import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'), // 데이터베이스 연결 상태 확인
      () => this.http.pingCheck('nestjs-docs', 'http://localhost:3000/health'), // 외부 URL 확인 (도메인 필요)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 메모리 사용량 확인 (힙 메모리)
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 메모리 사용량 확인 (전체 RSS 메모리)
    ]);
  }
}
