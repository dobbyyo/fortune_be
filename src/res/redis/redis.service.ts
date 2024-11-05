import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService as NestRedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisService {
  private readonly client: Redis | null;

  constructor(private readonly redisService: NestRedisService) {
    this.client = this.redisService.getOrNil(); // 설명: Redis 클라이언트를 가져옵니다.
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    // 설명: 지정된 키에 값을 설정합니다.
    if (!this.client) throw new Error('Redis client is not initialized'); // 설명: Redis 클라이언트가 초기화되지 않았을 때 에러를 발생시킵니다.
    await this.client.set(key, JSON.stringify(value)); // 설명: 지정된 키에 값을 설정합니다.
    if (ttl) await this.client.expire(key, ttl); // 설명: 지정된 키의 만료 시간을 설정합니다.
  }

  async get<T>(key: string): Promise<T | null> {
    // 설명: 지정된 키의 값을 가져옵니다.
    if (!this.client) throw new Error('Redis client is not initialized'); // 설명: Redis 클라이언트가 초기화되지 않았을 때 에러를 발생시킵니다.

    const value = await this.client.get(key); // 설명: 지정된 키의 값을 가져옵니다.
    return value ? JSON.parse(value) : null; // 설명: 지정된 키의 값을 반환합니다.
  }

  async del(key: string): Promise<void> {
    // 설명: 지정된 키의 값을 삭제합니다.
    if (!this.client) throw new Error('Redis client is not initialized'); // 설명: Redis 클라이언트가 초기화되지 않았을 때 에러를 발생시킵니다.
    await this.client.del(key); // 설명: 지정된 키의 값을 삭제합니다.
  }
}
