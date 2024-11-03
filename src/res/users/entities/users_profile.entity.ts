import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';

@Entity('users_profile')
export class UsersProfileEntity {
  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'varchar', nullable: true }) // 초기값이 없을 수 있도록 nullable 설정
  profile_url: string | null;

  @OneToOne(() => UsersEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  user: UsersEntity;
}
