import { BaseEntity } from '@/src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('web_information')
export class WebInformationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;
}
