import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Users } from '@res/users/entities/users.entity';
import { Sandbar } from '@res/fortunes/entities/sandbar.entity';
import { ZodiacFortune } from '@res/fortunes/entities/zodiac_fortune.entity';
import { StarSignFortune } from '@res/fortunes/entities/star_sign_fortune.entity';

@Entity('saved_sandbar')
export class SavedSandbars extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  todays_fortune_id: number;

  @Column({ type: 'int', nullable: false })
  zodiac_fortune_id: number;

  @Column({ type: 'int', nullable: false })
  star_sign_fortune_id: number;

  @CreateDateColumn()
  saved_at: Date;

  @ManyToOne(() => Users, (user) => user.savedSandbars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Sandbar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todays_fortune_id' })
  todays_fortune: Sandbar;

  @ManyToOne(() => ZodiacFortune, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zodiac_fortune_id' })
  zodiac_fortune: ZodiacFortune;

  @ManyToOne(() => StarSignFortune, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'star_sign_fortune_id' })
  star_sign_fortune: StarSignFortune;
}
