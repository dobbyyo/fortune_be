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
import { SavedUserTarotCardsEntity } from '../tarots/entities/saved_user_tarot_cards.entity';
import { SavedFortunesEntity } from '../fortunes/entities/saved_fortunes.entity';
import { SavedZodiacEntity } from '../fortunes/entities/saved_zodiac.entity';
import { SavedStarEntity } from '../fortunes/entities/saved_star.entity';
import { SavedSandbarsEntity } from '../fortunes/entities/saved_sandbars.entity';
import { SavedDreamInterpretationEntity } from '../dreams/entities/saved_dream_interpretation.entity';
import { SavedNamingEntity } from '../namings/entities/saved_naming.entity';
import { TarotCardsEntity } from '../tarots/entities/tarot_cards.entity';
import { StarSignFortuneEntity } from '../fortunes/entities/star_sign_fortune.entity';
import { ZodiacFortuneEntity } from '../fortunes/entities/zodiac_fortune.entity';
import { NamingEntity } from '../namings/entities/naming.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersLanguageEntity,
      UsersNotificationEntity,
      UsersPasswordEntity,
      UsersProfileEntity,
      SavedUserTarotCardsEntity,
      SavedFortunesEntity,
      SavedZodiacEntity,
      SavedStarEntity,
      SavedSandbarsEntity,
      SavedDreamInterpretationEntity,
      SavedNamingEntity,
      TarotCardsEntity,
      StarSignFortuneEntity,
      ZodiacFortuneEntity,
      NamingEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, RedisService],
  exports: [UsersService],
})
export class UsersModule {}
