import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from '@res/users/users.service';
import { UsersController } from '@res/users/users.controller';
import { UsersEntity } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RedisService } from '../redis/redis.service';
import { UsersLanguageEntity } from './entities/users_language.entity';
import { UsersNotificationEntity } from './entities/users_notification.entity';
import { UsersPasswordEntity } from './entities/users_password.entity';
import { UsersProfileEntity } from './entities/users_profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersLanguageEntity,
      UsersNotificationEntity,
      UsersPasswordEntity,
      UsersProfileEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, RedisService],
  exports: [UsersService],
})
export class UsersModule {}
