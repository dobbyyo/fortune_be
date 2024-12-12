import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('saved_star')
export class SavedStarEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  star_sign: string;

  @Column({ type: 'text', nullable: true })
  star_main_description: string;

  @Column({ type: 'text', nullable: true })
  star_sub_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  year: string;
}
