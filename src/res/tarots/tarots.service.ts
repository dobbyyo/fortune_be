import { BadRequestException, Injectable } from '@nestjs/common';
import { TarotCardsEntity } from './entities/tarot_cards.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TarotsService {
  constructor(
    @InjectRepository(TarotCardsEntity)
    private readonly tarotCardsRepository: Repository<TarotCardsEntity>,
  ) {}
  private getSubTitlesByMainTitle(mainTitle: string): string[] | null {
    const titles = {
      '오늘의 타로': ['애정운', '재물운', '학업&취업운'],
      '이달의 타로': ['총운', '행운', '주의', '사건', '처세술'],
      '연애 타로': ['연애운'],
      '취업 타로': ['취업운'],
    };
    return titles[mainTitle] || null;
  }

  private async getRandomCard(isMajor: boolean): Promise<TarotCardsEntity> {
    const queryBuilder = this.tarotCardsRepository.createQueryBuilder('card');
    if (isMajor) {
      queryBuilder.andWhere('card.type = :type', { type: 'Major' });
    } else {
      queryBuilder.andWhere('card.type = :type', { type: 'Minor' });
    }
    queryBuilder.orderBy('RAND()').limit(1); // 랜덤으로 카드 한 장 선택

    return await queryBuilder.getOne();
  }

  async drawTarot(mainTitle: string) {
    const subTitles = this.getSubTitlesByMainTitle(mainTitle);
    if (!subTitles) {
      throw new BadRequestException('Invalid main title');
    }

    const tarotCards = await Promise.all(
      subTitles.map(async (subTitle, index) => {
        // 메이저 카드가 반드시 포함되도록 첫 번째 카드로 메이저 카드 중 하나를 랜덤 선택
        const isMajor = index === 0;
        const card = await this.getRandomCard(isMajor);
        return {
          ...card,
          subTitle,
          isReversed: Math.random() < 0.5, // 50% 확률로 카드 뒤집기 설정
        };
      }),
    );

    return { tarotCards };
  }
}
