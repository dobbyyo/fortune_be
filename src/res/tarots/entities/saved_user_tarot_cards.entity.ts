import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Users } from '@res/users/entities/users.entity';
import { TarotCards } from '@res/tarots/entities/tarot_cards.entity';

@Entity('saved_user_tarot_cards')
export class SavedUserTarotCards extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  main_title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sub_title: string;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'int', nullable: false })
  card_id: number;

  @Column({ type: 'boolean', nullable: false })
  is_upright: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  card_name: string;

  @Column({ type: 'text', nullable: true })
  card_content: string;

  @Column({ type: 'text', nullable: true })
  card_interpretation: string;

  @Column({ type: 'text', nullable: true })
  card_meaning: string;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => TarotCards, (card) => card.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: TarotCards;
}
