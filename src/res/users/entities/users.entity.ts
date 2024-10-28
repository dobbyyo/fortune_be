import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersProfile } from '@res/users/entities/users_profile.entity';
import { UsersNotification } from '@res/users/entities/users_notification.entity';
import { UsersPassword } from '@res/users/entities/users_password.entity';
import { UsersLanguage } from '@res/users/entities/users_language.entity';
import { UsersToken } from '@res/users/entities/users_token.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';

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

  @OneToOne(() => UsersToken)
  @JoinColumn()
  token: UsersToken;
}
