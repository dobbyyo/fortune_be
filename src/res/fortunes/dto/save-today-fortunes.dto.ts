import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class SaveFortunesDto {
  @IsOptional()
  @IsString()
  totalFortuneTitle?: string;

  @IsOptional()
  @IsString()
  totalFortuneDescription?: string;

  @IsOptional()
  @IsString()
  wealthFortuneTitle?: string;

  @IsOptional()
  @IsString()
  wealthFortuneDescription?: string;

  @IsOptional()
  @IsString()
  loveFortuneTitle?: string;

  @IsOptional()
  @IsString()
  loveFortuneDescription?: string;

  @IsOptional()
  @IsString()
  businessFortuneTitle?: string;

  @IsOptional()
  @IsString()
  businessFortuneDescription?: string;

  @IsOptional()
  @IsString()
  healthFortuneTitle?: string;

  @IsOptional()
  @IsString()
  healthFortuneDescription?: string;

  @IsOptional()
  @IsString()
  studyFortuneTitle?: string;

  @IsOptional()
  @IsString()
  studyFortuneDescription?: string;

  @IsOptional()
  @IsString()
  luckyItemsTitle?: string;

  @IsOptional()
  @IsString()
  luckyItem1?: string;

  @IsOptional()
  @IsString()
  luckyItem2?: string;

  @IsOptional()
  @IsString()
  luckyOutfitTitle?: string;

  @IsOptional()
  @IsString()
  luckyOutfitDescription?: string;
}

// Zodiac Fortune DTO
export class SaveZodiacDto {
  @IsString()
  zodiacTitle: string;

  @IsOptional()
  @IsString()
  zodiacMainDescription?: string;

  @IsOptional()
  @IsString()
  zodiacSubDescription?: string;

  @IsString()
  yearOfBirth: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

// Star Sign DTO
export class SaveStarSignDto {
  @IsString()
  starSign: string;

  @IsOptional()
  @IsString()
  starMainDescription?: string;

  @IsOptional()
  @IsString()
  starSubDescription?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  year?: string;
}

export class SaveSandbarDto {
  @ApiProperty({ description: 'userId', example: '1' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsString()
  title: string;

  @ValidateNested()
  @Type(() => SaveFortunesDto)
  todaysFortune: SaveFortunesDto;

  @ValidateNested()
  @Type(() => SaveZodiacDto)
  zodiacFortune: SaveZodiacDto;

  @ValidateNested()
  @Type(() => SaveStarSignDto)
  starSignFortune: SaveStarSignDto;
}
