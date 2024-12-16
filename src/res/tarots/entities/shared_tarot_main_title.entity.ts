import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/src/common/entities/base.entity';
import { ShareTarotCardsEntity } from './share_tarot_cards.entity';

@Entity('share_tarot_main_title')
export class ShareTarotMainTitleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @OneToMany(() => ShareTarotCardsEntity, (card) => card.mainTitle)
  cards: ShareTarotCardsEntity[];
}
