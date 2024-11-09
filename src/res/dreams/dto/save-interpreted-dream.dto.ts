import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class saveInterpretedDreamDto {
  @ApiProperty({ description: 'AI 꿈 해몽 타이틀', example: '사람/행동' })
  @IsNotEmpty()
  @IsString()
  mainTitle: string;

  @ApiProperty({
    description: '유저가 작성한 꿈 설명',
    example: '설명',
  })
  @IsNotEmpty()
  @IsString()
  user_description: string;

  @ApiProperty({
    description: 'AI 꿈 해몽 결과',
    example: '해몽 내용',
  })
  @IsNotEmpty()
  @IsString()
  ai_interpretation: string;
}
