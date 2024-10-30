import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'do@gmail', description: 'Email' })
  email: string;

  @ApiProperty({ example: 'dobbyo', description: 'Nickname' })
  username: string;

  @ApiProperty({ example: 'man', description: 'gender', nullable: true })
  gender: string | null;

  @ApiProperty({
    example: '2021-01-01',
    description: 'birth_date',
    nullable: true,
  })
  birth_date: Date | null;

  @ApiProperty({ example: '12:00', description: 'birth_time', nullable: true })
  birth_time: string | null;

  @ApiProperty({ example: 'kakao', description: 'provider' })
  provider: string;
}
