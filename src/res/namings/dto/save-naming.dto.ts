import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class NamingDetailDto {
  @ApiProperty({ description: 'AI 작명명', example: '김땡떙' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'AI 작명 설명',
    example: '김땡떙은 어쩌고 저쩌고',
  })
  @IsString()
  description: string;
}

export class SaveNamingDto {
  @ApiProperty({ description: 'AI 작명 타이틀', example: '사람' })
  @IsString()
  mainTitle: string;

  @ApiProperty({
    description: 'AI 작명 결과',
    example: [
      {
        name: '김땡떙',
        description: '김땡떙은 어쩌고 저쩌고',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NamingDetailDto)
  namings: NamingDetailDto[];
}
