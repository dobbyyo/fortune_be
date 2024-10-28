import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('heavenly_stems')
export class HeavenlyStems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: ['목', '화', '토', '금', '수'],
    nullable: false,
  })
  element: '목' | '화' | '토' | '금' | '수';

  @Column({ type: 'enum', enum: ['음', '양'], nullable: false })
  yin_yang: '음' | '양';

  @Column({ type: 'varchar', length: 255, nullable: false })
  image_url: string;
}
