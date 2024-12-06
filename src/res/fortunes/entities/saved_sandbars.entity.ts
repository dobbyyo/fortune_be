import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';
import { SavedFortunesEntity } from '@/src/res/fortunes/entities/saved_fortunes.entity';
import { SavedZodiacEntity } from '@res/fortunes/entities/saved_zodiac.entity';
import { SavedStarEntity } from '@res/fortunes/entities/saved_star.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';

@Entity('saved_sandbar')
export class SavedSandbarsEntity extends BaseEntity {
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

  @ManyToOne(() => UsersEntity, (user) => user.savedSandbars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => SavedFortunesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todays_fortune_id' })
  todays_fortune: SavedFortunesEntity;

  @ManyToOne(() => SavedZodiacEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zodiac_fortune_id' })
  zodiac_fortune: SavedZodiacEntity;

  @ManyToOne(() => SavedStarEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'star_sign_fortune_id' })
  star_sign_fortune: SavedStarEntity;
}
