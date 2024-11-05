import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum Language {
  KOREAN = 'KOREAN',
  ENGLISH = 'ENGLISH',
}

export class UpdateLanguageDto {
  @ApiProperty({ example: 'KOREAN', description: 'language' })
  @IsEnum(Language, { message: 'language must be either KOREAN or ENGLISH' })
  @IsNotEmpty()
  language: string;
}
