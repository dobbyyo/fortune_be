import { Module } from '@nestjs/common';
import { UsersService } from '@res/users/users.service';
import { UsersController } from '@res/users/users.controller';
import { Users } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
