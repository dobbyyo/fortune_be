import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Users } from '@res/users/entities/users.entity';

@Entity('users_notification')
export class UsersNotification {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'boolean', default: false })
  benefit: boolean;

  @Column({ type: 'boolean', default: false })
  horoscope: boolean;

  @OneToOne(() => Users, (user) => user.notification, { onDelete: 'CASCADE' })
  user: Users;
}
