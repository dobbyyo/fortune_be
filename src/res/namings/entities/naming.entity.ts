import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SavedNamingEntity } from './saved_naming.entity';

@Entity('naming')
export class NamingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  mainTitle: string; // e.g., 사람, 반려동물, etc.

  @Column({ type: 'date', nullable: false })
  date: Date; // Date associated with the main title

  @OneToMany(() => SavedNamingEntity, (savedNaming) => savedNaming.naming)
  savedNamings: SavedNamingEntity[]; // Relation to saved names
}
