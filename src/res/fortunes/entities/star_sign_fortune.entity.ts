import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('star_sign_fortune')
export class StarSignFortuneEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  start_date: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  end_date: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  image_url: string;
}
