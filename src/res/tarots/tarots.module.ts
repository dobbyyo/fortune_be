import { Module } from '@nestjs/common';
import { TarotsService } from '@res/tarots/tarots.service';
import { TarotsController } from '@res/tarots/tarots.controller';
import { TarotCardsEntity } from './entities/tarot_cards.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TarotCardsEntity])],
  controllers: [TarotsController],
  providers: [TarotsService],
})
export class TarotsModule {}
