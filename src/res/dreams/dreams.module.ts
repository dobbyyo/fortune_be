import { Module } from '@nestjs/common';
import { DreamsService } from '@res/dreams/dreams.service';
import { DreamsController } from '@res/dreams/dreams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedDreamInterpretationEntity } from './entities/saved_dream_interpretation.entity';
import { OpenaiService } from '../openai/openai.service';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([SavedDreamInterpretationEntity])],
  controllers: [DreamsController],
  providers: [DreamsService, OpenaiService, RedisService],
})
export class DreamsModule {}
