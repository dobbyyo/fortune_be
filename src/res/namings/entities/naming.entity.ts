import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('naming')
export class Naming {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  naming_title: string;

  @Column({ type: 'text', nullable: true })
  naming_description: string;
}
