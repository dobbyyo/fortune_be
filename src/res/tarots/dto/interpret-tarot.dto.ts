// tarot/dto/tarot-interpretation.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class TarotCardDto {
  @ApiProperty({ description: '타로 카드 ID', example: 1 })
  @IsInt()
  cardId: number;

  @ApiProperty({ description: '소 타이틀', example: '애정운' })
  @IsString()
  subTitle: string;

  @ApiProperty({ description: '카드가 뒤집혔는지 여부', example: true })
  @IsBoolean()
  isReversed: boolean;
}

export class TarotInterpretationDto {
  @ApiProperty({
    description: '타로 카드 배열 (각 카드 정보 포함)',
    example: [
      { cardId: 1, subTitle: '애정운', isReversed: true },
      { cardId: 5, subTitle: '재물운', isReversed: false },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  cards: TarotCardDto[];
}
