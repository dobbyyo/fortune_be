import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Users } from '@res/users/entities/users.entity';

@Entity('users_password')
export class UsersPassword {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'boolean', default: false })
  password_lock_status: boolean;

  @Column({ type: 'varchar', nullable: false })
  hash_password: string;

  @OneToOne(() => Users, (user) => user.password, { onDelete: 'CASCADE' })
  user: Users;
}
