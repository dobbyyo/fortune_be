import { Module } from '@nestjs/common';
import { FortunesService } from '@res/fortunes/fortunes.service';
import { FortunesController } from '@res/fortunes/fortunes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedFortunesEntity } from './entities/saved_fortunes.entity';
import { OpenaiService } from '../openai/openai.service';
import { RedisService } from '../redis/redis.service';
import { FortuneCalculationService } from './fortunes-calculation.service';
import { EarthlyBranchesEntity } from './entities/earthly_baranches.entity';
import { HeavenlyStemsEntity } from './entities/heavenly_stems.entity';
import { ZodiacFortuneEntity } from './entities/zodiac_fortune.entity';
import { StarSignFortuneEntity } from './entities/star_sign_fortune.entity';
import { SavedStarEntity } from './entities/saved_star.entity';
import { SavedZodiacEntity } from './entities/saved_zodiac.entity';
import { SavedSandbarsEntity } from './entities/saved_sandbars.entity';
import { SpringDatesEntity } from './entities/spring.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SavedFortunesEntity,
      EarthlyBranchesEntity,
      HeavenlyStemsEntity,
      ZodiacFortuneEntity,
      StarSignFortuneEntity,
      SavedStarEntity,
      SavedZodiacEntity,
      SavedSandbarsEntity,
      SpringDatesEntity,
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
