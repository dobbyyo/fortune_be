import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Users } from '@res/users/entities/users.entity';

@Entity('users_profile')
export class UsersProfile {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'varchar', nullable: true }) // 초기값이 없을 수 있도록 nullable 설정
  profile_url: string | null;

  @OneToOne(() => Users, (user) => user.profile, { onDelete: 'CASCADE' })
  user: Users;
}
