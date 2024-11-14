import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('saved_fortunes')
export class SavedFortunesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  total_fortune_title: string;

  @Column({ type: 'text', nullable: true })
  total_fortune_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wealth_fortune_title: string;

  @Column({ type: 'text', nullable: true })
  wealth_fortune_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  love_fortune_title: string;

  @Column({ type: 'text', nullable: true })
  love_fortune_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  business_fortune_title: string;

  @Column({ type: 'text', nullable: true })
  business_fortune_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  health_fortune_title: string;

  @Column({ type: 'text', nullable: true })
  health_fortune_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  study_fortune_title: string;

  @Column({ type: 'text', nullable: true })
  study_fortune_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lucky_items_title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lucky_item_1: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lucky_item_2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lucky_outfit_title: string;

  @Column({ type: 'text', nullable: true })
  lucky_outfit_description: string;
}
