import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '@res/users/entities/users.entity';
import { Naming } from '@res/namings/entities/naming.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';

@Entity('saved_naming')
export class SavedNaming extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  naming_id: number;

  @ManyToOne(() => Users, (user) => user.savedNamings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Naming, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'naming_id' })
  naming: Naming;
}
