import { BaseEntity } from '@/src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TarotCardsEntity } from './tarot_cards.entity';
import { ShareTarotMainTitleEntity } from './shared_tarot_main_title.entity';

@Entity('share_tarot_cards')
export class ShareTarotCardsEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  sub_title: string;

  @Column({ type: 'int', nullable: false })
  card_id: number;

  @Column({ type: 'boolean', nullable: false })
  is_upright: boolean;

  @Column({ type: 'text', nullable: true })
  card_interpretation: string;

  // ManyToOne: 여러 개의 공유된 카드가 하나의 TarotCards와 연결
  @ManyToOne(() => TarotCardsEntity, (card) => card.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' }) // 실제 DB 컬럼 이름
  card: TarotCardsEntity;

  @ManyToOne(() => ShareTarotMainTitleEntity, (share) => share.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'main_title_id' })
  mainTitle: ShareTarotMainTitleEntity;
}
