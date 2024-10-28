import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Users } from '@res/users/entities/users.entity';

@Entity('users_language')
export class UsersLanguage {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'enum', enum: ['KOREAN', 'ENGLISH'] })
  language: string;

  @OneToOne(() => Users, (user) => user.language, { onDelete: 'CASCADE' })
  user: Users;
}
