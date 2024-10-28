import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('star_sign_fortune')
export class StarSignFortune {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  star_sign: string;

  @Column({ type: 'text', nullable: true })
  star_main_description: string;

  @Column({ type: 'text', nullable: true })
  star_sub_description: string;
}
