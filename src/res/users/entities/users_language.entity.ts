import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';

@Entity('users_language')
export class UsersLanguageEntity {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'enum', enum: ['KOREAN', 'ENGLISH'] })
  language: string;

  @OneToOne(() => UsersEntity, (user) => user.language, { onDelete: 'CASCADE' })
  user: UsersEntity;
}
