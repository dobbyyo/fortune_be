import { Module } from '@nestjs/common';
import { TarotsService } from '@res/tarots/tarots.service';
import { TarotsController } from '@res/tarots/tarots.controller';
import { TarotCardsEntity } from './entities/tarot_cards.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiService } from '../openai/openai.service';
import { SavedUserTarotCardsEntity } from './entities/saved_user_tarot_cards.entity';
import { RedisService } from '../redis/redis.service';
import { SaveTarotMainTitleEntity } from './entities/saved_tarot_main_title.entity';
import { ShareTarotCardsEntity } from './entities/share_tarot_cards.entity';
import { ShareTarotMainTitleEntity } from './entities/shared_tarot_main_title.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TarotCardsEntity,
      SavedUserTarotCardsEntity,
      SaveTarotMainTitleEntity,
      ShareTarotCardsEntity,
      ShareTarotMainTitleEntity,
    ]),
  ],
  controllers: [TarotsController],
  providers: [TarotsService, OpenaiService, RedisService],
})
export class TarotsModule {}
