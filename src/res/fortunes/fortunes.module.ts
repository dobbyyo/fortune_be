import { Module } from '@nestjs/common';
import { FortunesService } from '@res/fortunes/fortunes.service';
import { FortunesController } from '@res/fortunes/fortunes.controller';

@Module({
  controllers: [FortunesController],
  providers: [FortunesService],
})
export class FortunesModule {}
