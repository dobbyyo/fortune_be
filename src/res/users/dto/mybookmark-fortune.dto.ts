import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MybookmarkFortuneDto {
  @ApiProperty({ description: 'userId', example: '1' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    description: '북마크한 운세 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  fortuneId: number;

  @ApiProperty({
    description: '북마크한 띠운세 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  zodiacId: number;

  @ApiProperty({
    description: '북마크한 별자리 운세 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  startId: number;
}
