import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Users } from '@res/users/entities/users.entity';

@Entity('users_token')
export class UsersToken {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'varchar', nullable: true }) // 로그인 시 설정될 값이므로 nullable 허용
  refresh_token: string | null;

  @Column({ type: 'timestamp', nullable: true }) // 로그인 시 설정될 값이므로 nullable 허용
  expires_at: Date | null;

  @OneToOne(() => Users, (user) => user.token, { onDelete: 'CASCADE' })
  user: Users;
}
