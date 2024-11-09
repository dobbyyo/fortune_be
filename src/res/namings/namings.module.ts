import { Module } from '@nestjs/common';
import { NamingsService } from '@res/namings/namings.service';
import { NamingsController } from '@res/namings/namings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamingEntity } from './entities/naming.entity';
import { SavedNamingEntity } from './entities/saved_naming.entity';
import { OpenaiService } from '../openai/openai.service';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([NamingEntity, SavedNamingEntity])],
  controllers: [NamingsController],
  providers: [NamingsService, OpenaiService, RedisService],
})
export class NamingsModule {}
