import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';

@Entity('users_password')
export class UsersPasswordEntity {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'boolean', default: false })
  password_lock_status: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  hash_password: string | null;

  @OneToOne(() => UsersEntity, (user) => user.password, { onDelete: 'CASCADE' })
  user: UsersEntity;
}
