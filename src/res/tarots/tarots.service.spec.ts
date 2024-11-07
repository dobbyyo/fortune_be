import { Test, TestingModule } from '@nestjs/testing';
import { TarotsService } from './tarots.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { TarotCardsEntity } from './entities/tarot_cards.entity';

describe('TarotsService', () => {
  let tarotsService: TarotsService;
  let tarotCardsRepository: Repository<TarotCardsEntity>;

  const mockTarotCard = {
    id: 1,
    name: 'The Fool',
    type: 'Major',
    number: 0,
    suit: null,
    image_url: 'https://example.com/fool.jpg',
    upright_meaning: 'New beginnings',
    reversed_meaning: 'Recklessness',
  } as TarotCardsEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarotsService,
        {
          provide: getRepositoryToken(TarotCardsEntity),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(mockTarotCard),
            })),
          },
        },
      ],
    }).compile();

    tarotsService = module.get<TarotsService>(TarotsService);
    tarotCardsRepository = module.get<Repository<TarotCardsEntity>>(
      getRepositoryToken(TarotCardsEntity),
    );
  });

  it('should be defined', () => {
    expect(tarotsService).toBeDefined();
  });

  describe('drawTarot', () => {
    it('main title에 따라 결과 값 호출', async () => {
      const result = await tarotsService.drawTarot('오늘의 타로');

      expect(result).toEqual({
        tarotCards: [
          expect.objectContaining({
            ...mockTarotCard,
            subTitle: '애정운',
          }),
          expect.objectContaining({
            ...mockTarotCard,
            subTitle: '재물운',
          }),
          expect.objectContaining({
            ...mockTarotCard,
            subTitle: '학업&취업운',
          }),
        ],
      });
    });

    it('main title없는 타이틀 경우 에러 발생', async () => {
      await expect(tarotsService.drawTarot('잘못된 타이틀')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('첫 번째 카드에는 메이저 카드를 호출', async () => {
      const card = await tarotsService['getRandomCard'](true);

      expect(card).toEqual(mockTarotCard);
      expect(tarotCardsRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
