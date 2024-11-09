import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NamingEntity } from './naming.entity';
import { UsersEntity } from '@res/users/entities/users.entity';

@Entity('saved_naming')
export class SavedNamingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string; // Name associated with the main title

  @Column({ type: 'text', nullable: true })
  description: string; // Description associated with the name

  @ManyToOne(() => NamingEntity, (naming) => naming.savedNamings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'naming_id' })
  naming: NamingEntity; // Reference to the main title

  @ManyToOne(() => UsersEntity, (user) => user.savedNamings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity; // User who saved the naming
}
