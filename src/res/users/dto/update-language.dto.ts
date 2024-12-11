import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum Language {
  KOREAN = 'KOREAN',
  ENGLISH = 'ENGLISH',
}

export class UpdateLanguageDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: 'KOREAN', description: 'language' })
  @IsEnum(Language, { message: 'KOREAN or ENGLISH' })
  @IsNotEmpty()
  language: string;
}
