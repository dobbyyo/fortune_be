import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersProfileEntity } from '@res/users/entities/users_profile.entity';
import { UsersNotificationEntity } from '@res/users/entities/users_notification.entity';
import { UsersPasswordEntity } from '@res/users/entities/users_password.entity';
import { UsersLanguageEntity } from '@res/users/entities/users_language.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';
import { SavedUserTarotCardsEntity } from '@res/tarots/entities/saved_user_tarot_cards.entity';
import { SavedSandbarsEntity } from '@res/fortunes/entities/saved_sandbars.entity';
import { SavedDreamInterpretationEntity } from '@res/dreams/entities/saved_dream_interpretation.entity';
import { SavedNamingEntity } from '@res/namings/entities/saved_naming.entity';
import { SaveTarotMainTitleEntity } from '../../tarots/entities/saved_tarot_main_title.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'enum', enum: ['MAN', 'WOMAN', 'ETC'], nullable: true })
  gender: string | null;

  @Column({ type: 'date', nullable: true })
  birth_date: Date | null;

  @Column({ type: 'time', nullable: true })
  birth_time: string | null;

  @Column({ type: 'enum', enum: ['양력', '음력'], nullable: true })
  calendar_type: string;

  @OneToOne(() => UsersProfileEntity)
  @JoinColumn()
  profile: UsersProfileEntity;

  @OneToOne(() => UsersNotificationEntity)
  @JoinColumn()
  notification: UsersNotificationEntity;

  @OneToOne(() => UsersPasswordEntity)
  @JoinColumn()
  password: UsersPasswordEntity;

  @OneToOne(() => UsersLanguageEntity)
  @JoinColumn()
  language: UsersLanguageEntity;

  @OneToMany(() => SaveTarotMainTitleEntity, (mainTitle) => mainTitle.user, {
    cascade: true,
  })
  savedTarotMainTitles: SaveTarotMainTitleEntity[];

  @OneToMany(() => SavedUserTarotCardsEntity, (savedCard) => savedCard.user, {
    cascade: true,
  })
  savedCards: SavedUserTarotCardsEntity[];

  @OneToMany(() => SavedSandbarsEntity, (savedSandbar) => savedSandbar.user, {
    cascade: true,
  })
  savedSandbars: SavedSandbarsEntity[];

  @OneToMany(
    () => SavedDreamInterpretationEntity,
    (savedDream) => savedDream.user,
    {
      cascade: true,
    },
  )
  savedDreamInterpretations: SavedDreamInterpretationEntity[];

  @OneToMany(() => SavedNamingEntity, (savedNaming) => savedNaming.user, {
    cascade: true,
  })
  savedNamings: SavedNamingEntity[];
}
