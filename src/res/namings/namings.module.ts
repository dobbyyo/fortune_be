import { Module } from '@nestjs/common';
import { NamingsService } from '@res/namings/namings.service';
import { NamingsController } from '@res/namings/namings.controller';

@Module({
  controllers: [NamingsController],
  providers: [NamingsService],
})
export class NamingsModule {}
