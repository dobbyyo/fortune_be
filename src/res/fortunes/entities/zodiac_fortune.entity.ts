import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('zodiac_fortune')
export class ZodiacFortuneEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  info: string;

  @Column({ type: 'int', nullable: false })
  start_year: number;

  @Column({ type: 'int', nullable: false })
  cycle: number;

  @Column({ type: 'int', nullable: false })
  rest: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;
}
