import { Test, TestingModule } from '@nestjs/testing';
import { TarotsService } from './tarots.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { SaveTarotMainTitleEntity } from './entities/saved_tarot_main_title.entity';
import { OpenaiService } from '../openai/openai.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TarotCardsEntity } from './entities/tarot_cards.entity';
import { TarotInterpretationDto } from './dto/interpret-tarot.dto';
import { SaveTarotCardDto } from './dto/save-tarot.dto';
import { SavedUserTarotCardsEntity } from './entities/saved_user_tarot_cards.entity';

describe('TarotsService', () => {
  let tarotsService: TarotsService;
  let tarotCardsRepository: Repository<TarotCardsEntity>;
  let savedUserTarotCardsRepository: Repository<SavedUserTarotCardsEntity>;
  let saveTarotMainTitleEntity: Repository<SaveTarotMainTitleEntity>;
  let openaiService: OpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarotsService,
        {
          provide: getRepositoryToken(TarotCardsEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SavedUserTarotCardsEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SaveTarotMainTitleEntity),
          useClass: Repository,
        },
        {
          provide: OpenaiService,
          useValue: {
            getTarotCardInterpretation: jest.fn(), // OpenAI 해석 메서드를 모킹
          },
        },
      ],
    }).compile();

    tarotsService = module.get<TarotsService>(TarotsService);
    tarotCardsRepository = module.get<Repository<TarotCardsEntity>>(
      getRepositoryToken(TarotCardsEntity),
    );
    openaiService = module.get<OpenaiService>(OpenaiService);
    savedUserTarotCardsRepository = module.get<
      Repository<SavedUserTarotCardsEntity>
    >(getRepositoryToken(SavedUserTarotCardsEntity));
    saveTarotMainTitleEntity = module.get<Repository<SaveTarotMainTitleEntity>>(
      getRepositoryToken(SaveTarotMainTitleEntity),
    );
  });

  describe('drawTarot', () => {
    it('타로 카드 뽑기', async () => {
      const mainTitle = '오늘의 타로';
      const subTitles = ['애정운', '재물운', '학업&취업운'];

      const mockCard = {
        id: 1,
        name: 'The Fool',
        type: 'Major',
        card_num: 0,
        suit: null,
        image_url: 'https://example.com/fool.jpg',
        upright_meaning: 'New beginnings',
        reversed_meaning: 'Recklessness',
      };

      jest
        .spyOn(tarotsService as any, 'getSubTitlesByMainTitle')
        .mockReturnValue(subTitles);
      jest
        .spyOn(tarotsService as any, 'getRandomCard')
        .mockResolvedValue(mockCard as TarotCardsEntity);

      const result = await tarotsService.drawTarot(mainTitle);

      expect(result).toHaveProperty('tarotCards');
      expect(result.tarotCards.length).toBe(subTitles.length);
      expect(result.tarotCards[0].type).toBe('Major'); // 첫 번째 카드가 Major인지 확인
    });

    it('에러 발생', async () => {
      await expect(tarotsService.drawTarot('잘못된 타이틀')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('interpretTarotCards', () => {
    it('AI를 활용하여 타로카드 해석', async () => {
      const tarotInterpretationDto: TarotInterpretationDto = {
        cards: [
          { cardId: 1, subTitle: '애정운', isReversed: false },
          { cardId: 2, subTitle: '재물운', isReversed: true },
        ],
      };

      const mockCard1 = {
        id: 1,
        name: 'The Fool',
        type: 'Major',
        card_num: 0,
        suit: null,
        image_url: 'https://example.com/fool.jpg',
        upright_meaning: 'New beginnings',
        reversed_meaning: 'Recklessness',
      };

      const mockCard2 = {
        id: 2,
        name: 'The Magician',
        type: 'Major',
        card_num: 1,
        suit: null,
        image_url: 'https://example.com/magician.jpg',
        upright_meaning: 'Power',
        reversed_meaning: 'Manipulation',
      };

      jest
        .spyOn(tarotCardsRepository, 'findOneBy')
        .mockResolvedValueOnce(mockCard1 as TarotCardsEntity)
        .mockResolvedValueOnce(mockCard2 as TarotCardsEntity);

      jest
        .spyOn(openaiService, 'getTarotCardInterpretation')
        .mockResolvedValueOnce('Interpretation for The Fool in 애정운')
        .mockResolvedValueOnce('Interpretation for The Magician in 재물운');

      const result = await tarotsService.interpretTarotCards(
        tarotInterpretationDto,
      );

      expect(result).toEqual({
        tarotCards: [
          {
            id: mockCard1.id,
            name: mockCard1.name,
            type: mockCard1.type,
            card_num: mockCard1.card_num,
            suit: mockCard1.suit,
            image_url: mockCard1.image_url,
            subTitle: '애정운',
            isReversed: false,
            interpretation: 'Interpretation for The Fool in 애정운',
          },
          {
            id: mockCard2.id,
            name: mockCard2.name,
            type: mockCard2.type,
            card_num: mockCard2.card_num,
            suit: mockCard2.suit,
            image_url: mockCard2.image_url,
            subTitle: '재물운',
            isReversed: true,
            interpretation: 'Interpretation for The Magician in 재물운',
          },
        ],
      });

      expect(tarotCardsRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(openaiService.getTarotCardInterpretation).toHaveBeenCalledTimes(2);
    });

    it('카드 없을 시 에러 발생', async () => {
      const tarotInterpretationDto: TarotInterpretationDto = {
        cards: [{ cardId: 999, subTitle: '애정운', isReversed: false }],
      };

      jest.spyOn(tarotCardsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        tarotsService.interpretTarotCards(tarotInterpretationDto),
      ).rejects.toThrow(
        new NotFoundException('카드 ID 999를 찾을 수 없습니다.'),
      );
    });
  });

  describe('TarotsService', () => {
    let tarotsService: TarotsService;
    let tarotCardsRepository: Repository<TarotCardsEntity>;
    let savedUserTarotCardsRepository: Repository<SavedUserTarotCardsEntity>;
    let saveTarotMainTitleEntity: Repository<SaveTarotMainTitleEntity>;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TarotsService,
          {
            provide: getRepositoryToken(TarotCardsEntity),
            useClass: Repository,
          },
          {
            provide: getRepositoryToken(SavedUserTarotCardsEntity),
            useClass: Repository,
          },
          {
            provide: getRepositoryToken(SaveTarotMainTitleEntity),
            useClass: Repository,
          },
          {
            provide: OpenaiService,
            useValue: {
              getTarotCardInterpretation: jest
                .fn()
                .mockResolvedValue('Sample interpretation'),
            },
          },
        ],
      }).compile();

      tarotsService = module.get<TarotsService>(TarotsService);
      tarotCardsRepository = module.get<Repository<TarotCardsEntity>>(
        getRepositoryToken(TarotCardsEntity),
      );
      savedUserTarotCardsRepository = module.get<
        Repository<SavedUserTarotCardsEntity>
      >(getRepositoryToken(SavedUserTarotCardsEntity));
      saveTarotMainTitleEntity = module.get<
        Repository<SaveTarotMainTitleEntity>
      >(getRepositoryToken(SaveTarotMainTitleEntity));
    });
    describe('saveTarotCards', () => {
      it('메인 타이틀과 함께 카드 저장', async () => {
        const userId = 1;
        const saveTarotCardDto: SaveTarotCardDto = {
          mainTitle: '오늘의 타로',
          cards: [
            {
              cardId: 1,
              subTitle: '애정운',
              isReversed: false,
              cardInterpretation: 'Sample interpretation',
            },
          ],
        };

        const mockCard = {
          id: 1,
          name: 'The Fool',
          type: 'Major',
          card_num: 0,
          suit: null,
          image_url: 'https://example.com/fool.jpg',
          upright_meaning: 'New beginnings',
          reversed_meaning: 'Recklessness',
        };

        const mockMainTitleEntity = {
          id: 1,
          title: '오늘의 타로',
          user: { id: userId },
        };
        jest.spyOn(saveTarotMainTitleEntity, 'findOne').mockResolvedValue(null);
        jest
          .spyOn(saveTarotMainTitleEntity, 'create')
          .mockReturnValue(mockMainTitleEntity as SaveTarotMainTitleEntity);
        jest
          .spyOn(saveTarotMainTitleEntity, 'save')
          .mockResolvedValue(mockMainTitleEntity as SaveTarotMainTitleEntity);
        jest
          .spyOn(tarotCardsRepository, 'findOneBy')
          .mockResolvedValue(mockCard as TarotCardsEntity);
        jest
          .spyOn(savedUserTarotCardsRepository, 'create')
          .mockImplementation((entity) => entity as SavedUserTarotCardsEntity);
        jest.spyOn(savedUserTarotCardsRepository, 'save').mockImplementation(
          async (entity) =>
            ({
              ...entity,
              id: 1,
              user: { id: userId } as any,
              card: mockCard,
              mainTitle: mockMainTitleEntity,
            }) as SavedUserTarotCardsEntity,
        );
        const result = await tarotsService.saveTarotCards(
          userId,
          saveTarotCardDto,
        );

        expect(result).toEqual({
          savedCards: [
            {
              user: { id: userId },
              card: {
                id: 1,
                card_num: 0,
                name: 'The Fool',
                type: 'Major',
                suit: null,
                image_url: 'https://example.com/fool.jpg',
                upright_meaning: 'New beginnings',
                reversed_meaning: 'Recklessness',
              },
              mainTitle: mockMainTitleEntity,
              sub_title: '애정운',
              is_upright: true,
              card_interpretation: 'Sample interpretation',
              id: 1,
            },
          ],
        });
        expect(saveTarotMainTitleEntity.findOne).toHaveBeenCalledWith({
          where: expect.objectContaining({
            title: '오늘의 타로',
            user: { id: userId },
            updated_at: expect.objectContaining({
              _type: 'moreThan',
            }),
          }),
          relations: ['cards'],
        });
        expect(saveTarotMainTitleEntity.save).toHaveBeenCalled();
        expect(savedUserTarotCardsRepository.save).toHaveBeenCalledTimes(1);
      });
    });
  });
});
