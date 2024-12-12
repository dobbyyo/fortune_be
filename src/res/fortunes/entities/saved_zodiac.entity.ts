import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('saved_zodiac')
export class SavedZodiacEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  zodiac_title: string;

  @Column({ type: 'text', nullable: true })
  zodiac_main_description: string;

  @Column({ type: 'text', nullable: true })
  zodiac_sub_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  year_of_birth: string;
}
