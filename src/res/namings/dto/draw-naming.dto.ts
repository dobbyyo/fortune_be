import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DrawNamingDto {
  @ApiProperty({ description: 'AI 작명', example: '사람' })
  @IsString()
  @IsNotEmpty()
  mainTitle: string;

  @ApiProperty({
    description: '간단한 설명',
    example: '모던한 느낌의 사람 이름',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
