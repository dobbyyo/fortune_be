import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { NamingEntity } from './naming.entity';
import { UsersEntity } from '@res/users/entities/users.entity';
import { BaseEntity } from '@/src/common/entities/base.entity';

@Entity('saved_naming')
export class SavedNamingEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => NamingEntity, (naming) => naming.savedNamings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'naming_id' })
  naming: NamingEntity;

  @ManyToOne(() => UsersEntity, (user) => user.savedNamings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
