import { Module } from '@nestjs/common';
import { FortunesService } from '@res/fortunes/fortunes.service';
import { FortunesController } from '@res/fortunes/fortunes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SandbarEntity } from './entities/sandbar.entity';
import { OpenaiService } from '../openai/openai.service';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([SandbarEntity])],
  controllers: [FortunesController],
  providers: [FortunesService, OpenaiService, RedisService],
})
export class FortunesModule {}
