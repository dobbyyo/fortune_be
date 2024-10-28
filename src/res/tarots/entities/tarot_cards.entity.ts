import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tarot_cards')
export class TarotCards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: ['Major', 'Minor'], nullable: false })
  type: 'Major' | 'Minor';

  @Column({ type: 'int', nullable: false })
  number: number;

  @Column({
    type: 'enum',
    enum: ['Wands', 'Cups', 'Swords', 'Pentacles', null],
    nullable: true,
  })
  suit: 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  image_url: string;

  @Column({ type: 'text', nullable: false })
  upright_meaning: string;

  @Column({ type: 'text', nullable: false })
  reversed_meaning: string;
}
