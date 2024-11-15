import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteSandbarDto {
  @ApiProperty({ description: 'sandbarId', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  sandbarId: number;

  @ApiProperty({ description: 'userId', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
