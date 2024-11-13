import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetTodayFortunesDto {
  @ApiProperty({ description: 'userId', example: '1' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number) // string을 number로 변환
  userId: number;
}
