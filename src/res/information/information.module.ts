import { Module } from '@nestjs/common';
import { InformationService } from './information.service';
import { InformationController } from './information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebInformationEntity } from './entities/web_information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WebInformationEntity])],
  controllers: [InformationController],
  providers: [InformationService],
})
export class InformationModule {}
