import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class ShareTarotCardDto {
  @ApiProperty({
    description: '메인 타이틀 (예: 오늘의 타로)',
    example: '오늘의 타로',
  })
  @IsString()
  mainTitle: string;

  @ApiProperty({
    description: '타로 카드 정보 배열',
    example: [
      {
        cardId: 1,
        subTitle: '애정운',
        isReversed: true,
        cardInterpretation: '...',
      },
      {
        cardId: 2,
        subTitle: '재물운',
        isReversed: false,
        cardInterpretation: '...',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TarotCardDetailDto)
  cards: TarotCardDetailDto[];
}

export class TarotCardDetailDto {
  @ApiProperty({ description: '카드 ID', example: 1 })
  @IsInt()
  cardId: number;

  @ApiProperty({ description: '서브 타이틀', example: '애정운' })
  @IsString()
  subTitle: string;

  @ApiProperty({ description: '카드가 뒤집힌 상태인지 여부', example: true })
  @IsBoolean()
  isReversed: boolean;

  @ApiProperty({ description: '카드 해석', example: '...' })
  @IsString()
  cardInterpretation: string;
}
