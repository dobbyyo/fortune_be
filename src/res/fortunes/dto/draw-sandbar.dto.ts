import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class DrawSandbarDto {
  @ApiProperty({ description: '시작 날짜', example: '2021-01-01' })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: '마감 날짜', example: '2021-01-01' })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @ApiProperty({ description: 'userId', example: '1' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number) // string을 number로 변환
  userId: number;
}
