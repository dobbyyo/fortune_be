import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { SavedUserTarotCardsEntity } from './saved_user_tarot_cards.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';

@Entity('save_tarot_main_title')
export class SaveTarotMainTitleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @OneToMany(() => SavedUserTarotCardsEntity, (card) => card.mainTitle)
  cards: SavedUserTarotCardsEntity[];
}
