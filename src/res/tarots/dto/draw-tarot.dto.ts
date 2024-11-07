import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DrawTarotDto {
  @ApiProperty({ description: '타로 카드 메인 타이틀', example: '오늘의 타로' })
  @IsString()
  @IsNotEmpty()
  mainTitle: string;
}
