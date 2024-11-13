import { Module } from '@nestjs/common';
import { FortunesService } from '@res/fortunes/fortunes.service';
import { FortunesController } from '@res/fortunes/fortunes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SandbarEntity } from './entities/sandbar.entity';
import { OpenaiService } from '../openai/openai.service';
import { RedisService } from '../redis/redis.service';
import { FortuneCalculationService } from './fortunes-calculation.service';
import { EarthlyBranchesEntity } from './entities/earthly_baranches.entity';
import { HeavenlyStemsEntity } from './entities/heavenly_stems.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SandbarEntity,
      EarthlyBranchesEntity,
      HeavenlyStemsEntity,
    ]),
  ],
  controllers: [FortunesController],
  providers: [
    FortunesService,
    OpenaiService,
    RedisService,
    FortuneCalculationService,
  ],
})
export class FortunesModule {}
