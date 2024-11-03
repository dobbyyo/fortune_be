import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('zodiac_fortune')
export class ZodiacFortuneEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  zodiac_sign: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  zodiac_title: string;

  @Column({ type: 'text', nullable: true })
  zodiac_main_description: string;

  @Column({ type: 'text', nullable: true })
  zodiac_sub_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  year_of_birth: string;
}
