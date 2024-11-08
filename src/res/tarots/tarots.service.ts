import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TarotCardsEntity } from './entities/tarot_cards.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TarotInterpretationDto } from './dto/interpret-tarot.dto';
import { OpenaiService } from '../openai/openai.service';
import { SavedUserTarotCardsEntity } from './entities/saved_user_tarot_cards.entity';
import { SaveTarotCardDto } from './dto/save-tarot.dto';
import { SaveTarotMainTitleEntity } from './entities/saved_tarot_main_title.entity';

@Injectable()
export class TarotsService {
  constructor(
    @InjectRepository(TarotCardsEntity)
    private readonly tarotCardsRepository: Repository<TarotCardsEntity>,
    @InjectRepository(SavedUserTarotCardsEntity)
    private readonly savedUserTarotCardsRepository: Repository<SavedUserTarotCardsEntity>,
    @InjectRepository(SaveTarotMainTitleEntity)
    private readonly saveTarotMainTitleEntity: Repository<SaveTarotMainTitleEntity>,
    private readonly openaiService: OpenaiService,
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

  // mainTitle이 이미 존재하면 반환하고, 그렇지 않으면 새로 생성하는 메서드
  private async getOrCreateMainTitle(userId: number, mainTitle: string) {
    let mainTitleEntity = await this.saveTarotMainTitleEntity.findOne({
      where: { title: mainTitle, user: { id: userId } },
    });

    if (!mainTitleEntity) {
      mainTitleEntity = this.saveTarotMainTitleEntity.create({
        title: mainTitle,
        user: { id: userId },
      });
      await this.saveTarotMainTitleEntity.save(mainTitleEntity);
    }
    return mainTitleEntity;
  }

  // 카드 뽑기
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

  // 카드 해석
  async interpretTarotCards(tarotInterpretationDto: TarotInterpretationDto) {
    const results = await Promise.all(
      tarotInterpretationDto.cards.map(
        async ({ cardId, subTitle, isReversed }) => {
          const card = await this.tarotCardsRepository.findOneBy({
            id: cardId,
          });
          if (!card)
            throw new NotFoundException(
              `카드 ID ${cardId}를 찾을 수 없습니다.`,
            );

          // 카드를 뒤집은 상태인지에 따라 의미 설정
          const meaning = isReversed
            ? card.reversed_meaning
            : card.upright_meaning;
          const interpretation =
            await this.openaiService.getTarotCardInterpretation(
              card.name,
              meaning,
              subTitle,
            );

          return {
            id: card.id,
            name: card.name,
            type: card.type,
            card_num: card.card_num,
            suit: card.suit,
            image_url: card.image_url,
            subTitle,
            isReversed,
            interpretation,
          };
        },
      ),
    );

    return { tarotCards: results };
  }

  // 카드 저장
  async saveTarotCards(userId: number, saveTarotCardDto: SaveTarotCardDto) {
    const { mainTitle, cards } = saveTarotCardDto;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 특정 날짜와 사용자에 대해 이미 존재하는 mainTitle 엔티티 조회
    const existingMainTitle = await this.saveTarotMainTitleEntity.findOne({
      where: {
        title: mainTitle,
        user: { id: userId },
        updated_at: MoreThan(today),
      },
      relations: ['cards'], // 관련된 카드들 함께 조회
    });

    // 기존 mainTitle이 있으면 삭제 (연관된 카드들 모두 삭제)
    if (existingMainTitle) {
      await this.saveTarotMainTitleEntity.remove(existingMainTitle);
    }

    // 새로운 mainTitle 생성 후 카드들 저장
    const mainTitleEntity = this.saveTarotMainTitleEntity.create({
      title: mainTitle,
      user: { id: userId },
    });
    await this.saveTarotMainTitleEntity.save(mainTitleEntity);

    // 새 카드 저장
    const savedCards = await Promise.all(
      cards.map(async (cardDetail) => {
        const { cardId, subTitle, isReversed, cardInterpretation } = cardDetail;
        const card = await this.tarotCardsRepository.findOneBy({ id: cardId });
        if (!card)
          throw new NotFoundException(`Card with ID ${cardId} not found`);

        const savedCard = this.savedUserTarotCardsRepository.create({
          user: { id: userId },
          card: { id: cardId },
          mainTitle: mainTitleEntity,
          sub_title: subTitle,
          is_upright: !isReversed,
          card_interpretation: cardInterpretation,
        });
        return await this.savedUserTarotCardsRepository.save(savedCard);
      }),
    );

    return savedCards;
  }
}
