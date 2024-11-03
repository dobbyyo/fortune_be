import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';

@Entity('users_notification')
export class UsersNotificationEntity {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'boolean', default: false })
  benefit: boolean;

  @Column({ type: 'boolean', default: false })
  horoscope: boolean;

  @OneToOne(() => UsersEntity, (user) => user.notification, {
    onDelete: 'CASCADE',
  })
  user: UsersEntity;
}
