import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';

@Entity('saved_dream_interpretation')
export class SavedDreamInterpretationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  user_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => UsersEntity, (user) => user.savedDreamInterpretations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
