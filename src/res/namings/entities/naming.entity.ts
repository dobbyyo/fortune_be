import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SavedNamingEntity } from './saved_naming.entity';

@Entity('naming')
export class NamingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  mainTitle: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @OneToMany(() => SavedNamingEntity, (savedNaming) => savedNaming.naming)
  savedNamings: SavedNamingEntity[];
}
