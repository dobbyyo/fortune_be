import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '@res/users/entities/users.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';

@Entity('saved_dream_interpretation')
export class SavedDreamInterpretation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  user_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Users, (user) => user.savedDreamInterpretations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
