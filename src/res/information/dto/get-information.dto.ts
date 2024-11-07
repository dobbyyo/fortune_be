import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class GetInformationDto {
  @ApiProperty({ example: '2021-01-01', description: 'start_date' })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2021-01-31', description: 'end_date' })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @ApiProperty({ example: 1, description: 'page' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  page: number;

  @ApiProperty({ example: 10, description: 'limit' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @Min(10)
  limit: number;
}
