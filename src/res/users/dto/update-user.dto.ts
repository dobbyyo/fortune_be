import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: '홍길동', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '2022-01-01', description: 'birth_date' })
  @IsString()
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({ example: '12:00:00', description: 'birth_time' })
  @IsString()
  @IsNotEmpty()
  birth_time: string;

  @ApiProperty({ example: 'MAN', description: 'gender' })
  @IsString()
  @IsNotEmpty()
  gender: string;
}
