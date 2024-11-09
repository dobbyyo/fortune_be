import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InterpretDreamDto {
  @ApiProperty({ description: '타이틀', example: '사람/행동' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '꿈 해몽', example: '꿈 해몽 내용' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
