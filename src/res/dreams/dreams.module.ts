import { Module } from '@nestjs/common';
import { DreamsService } from '@res/dreams/dreams.service';
import { DreamsController } from '@res/dreams/dreams.controller';

@Module({
  controllers: [DreamsController],
  providers: [DreamsService],
})
export class DreamsModule {}
