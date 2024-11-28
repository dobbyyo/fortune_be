import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'dobby', description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'kakao', description: 'Provider' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: 'do@gamil.com', description: 'Email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MAN', description: 'gender' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: '2021-01-01', description: 'birth_date' })
  @IsString()
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({ example: '12:00:00', description: 'birth_time' })
  @IsString()
  @IsNotEmpty()
  birth_time: string;

  @ApiProperty({ example: 'https://naver.com', description: 'avatar' })
  @IsString()
  @IsNotEmpty()
  avatar: string;
}
