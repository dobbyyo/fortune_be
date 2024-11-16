import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('spring_dates')
export class SpringDatesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  year: number;

  @Column({ type: 'datetime' })
  date: Date;
}
