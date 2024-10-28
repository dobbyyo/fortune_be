import { Module } from '@nestjs/common';
import { UsersService } from '@res/users/users.service';
import { UsersController } from '@res/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
