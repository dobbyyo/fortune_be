import { Module } from '@nestjs/common';
import { TarotsService } from '@res/tarots/tarots.service';
import { TarotsController } from '@res/tarots/tarots.controller';

@Module({
  controllers: [TarotsController],
  providers: [TarotsService],
})
export class TarotsModule {}
