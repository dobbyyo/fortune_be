import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';
import { NamingEntity } from '@res/namings/entities/naming.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';

@Entity('saved_naming')
export class SavedNamingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  naming_id: number;

  @ManyToOne(() => UsersEntity, (user) => user.savedNamings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => NamingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'naming_id' })
  naming: NamingEntity;
}
