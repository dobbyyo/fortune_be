import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersProfile } from '@res/users/entities/users_profile.entity';
import { UsersNotification } from '@res/users/entities/users_notification.entity';
import { UsersPassword } from '@res/users/entities/users_password.entity';
import { UsersLanguage } from '@res/users/entities/users_language.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';
import { SavedUserTarotCards } from '@res/tarots/entities/saved_user_tarot_cards.entity';
import { SavedSandbars } from '@res/fortunes/entities/saved_sandbars.entity';
import { SavedDreamInterpretation } from '@res/dreams/entities/saved_dream_interpretation.entity';
import { SavedNaming } from '@res/namings/entities/saved_naming.entity';

@Entity('users')
export class Users extends BaseEntity {
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

  @OneToOne(() => UsersProfile)
  @JoinColumn()
  profile: UsersProfile;

  @OneToOne(() => UsersNotification)
  @JoinColumn()
  notification: UsersNotification;

  @OneToOne(() => UsersPassword)
  @JoinColumn()
  password: UsersPassword;

  @OneToOne(() => UsersLanguage)
  @JoinColumn()
  language: UsersLanguage;

  @OneToMany(() => SavedUserTarotCards, (savedCard) => savedCard.user, {
    cascade: true,
  })
  savedCards: SavedUserTarotCards[];

  @OneToMany(() => SavedSandbars, (savedSandbar) => savedSandbar.user, {
    cascade: true,
  })
  savedSandbars: SavedSandbars[];

  @OneToMany(() => SavedDreamInterpretation, (savedDream) => savedDream.user, {
    cascade: true,
  })
  savedDreamInterpretations: SavedDreamInterpretation[];

  @OneToMany(() => SavedNaming, (savedNaming) => savedNaming.user, {
    cascade: true,
  })
  savedNamings: SavedNaming[];
}
