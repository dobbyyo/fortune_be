import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('earthly_branches')
export class EarthlyBranchesEntity {
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

  @Column({ type: 'varchar', length: 255, nullable: false })
  image_url: string;
}
