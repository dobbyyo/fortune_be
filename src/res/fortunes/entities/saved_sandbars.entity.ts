import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';
import { SandbarEntity } from '@res/fortunes/entities/sandbar.entity';
import { ZodiacFortuneEntity } from '@res/fortunes/entities/zodiac_fortune.entity';
import { StarSignFortuneEntity } from '@res/fortunes/entities/star_sign_fortune.entity';

@Entity('saved_sandbar')
export class SavedSandbarsEntity extends BaseEntity {
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

  @ManyToOne(() => UsersEntity, (user) => user.savedSandbars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => SandbarEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todays_fortune_id' })
  todays_fortune: SandbarEntity;

  @ManyToOne(() => ZodiacFortuneEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zodiac_fortune_id' })
  zodiac_fortune: ZodiacFortuneEntity;

  @ManyToOne(() => StarSignFortuneEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'star_sign_fortune_id' })
  star_sign_fortune: StarSignFortuneEntity;
}
