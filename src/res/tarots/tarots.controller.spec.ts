import { Test, TestingModule } from '@nestjs/testing';
import { TarotsController } from './tarots.controller';
import { TarotsService } from './tarots.service';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { DrawTarotDto } from './dto/draw-tarot.dto';
import { TarotInterpretationDto } from './dto/interpret-tarot.dto';
import { SaveTarotCardDto } from './dto/save-tarot.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { Request } from 'express';
import { SavedUserTarotCardsEntity } from './entities/saved_user_tarot_cards.entity';
import { SaveTarotMainTitleEntity } from './entities/saved_tarot_main_title.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { TarotCardsEntity } from './entities/tarot_cards.entity';

describe('TarotsController', () => {
  let tarotsController: TarotsController;
  let tarotsService: TarotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarotsController],
      providers: [
        {
          provide: TarotsService,
          useValue: {
            drawTarot: jest.fn(),
            interpretTarotCards: jest.fn(),
            saveTarotCards: jest.fn(),
            cancelSavedTarotCard: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    tarotsController = module.get<TarotsController>(TarotsController);
    tarotsService = module.get<TarotsService>(TarotsService);
  });

  it('should be defined', () => {
    expect(tarotsController).toBeDefined();
  });

  describe('drawTarot', () => {
    it('카드 뽑기', async () => {
      const drawTarotDto: DrawTarotDto = { mainTitle: '오늘의 타로' };
      const decodedMainTitle = decodeURIComponent(drawTarotDto.mainTitle);

      const tarotCardsMock = {
        tarotCards: [
          {
            id: 1,
            name: 'The Fool',
            type: 'Major' as 'Major' | 'Minor',
            card_num: 0,
            suit: null as 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null,
            image_url: 'https://example.com/fool.jpg',
            upright_meaning: 'New beginnings',
            reversed_meaning: 'Recklessness',
            subTitle: '애정운',
            isReversed: false,
          },
        ],
      };

      jest.spyOn(tarotsService, 'drawTarot').mockResolvedValue(tarotCardsMock);

      const result = await tarotsController.drawTarot(drawTarotDto);
      expect(result).toEqual(createResponse(200, 'successful', tarotCardsMock));
      expect(tarotsService.drawTarot).toHaveBeenCalledWith(decodedMainTitle);
    });
  });

  describe('interpretTarotCards', () => {
    it('카드 해석', async () => {
      const tarotInterpretationDto: TarotInterpretationDto = {
        cards: [{ cardId: 1, subTitle: '애정운', isReversed: false }],
      };
      const interpretationsMock = {
        tarotCards: [
          {
            id: 1,
            name: 'The Fool',
            type: 'Major' as 'Major' | 'Minor',
            card_num: 0,
            suit: null as 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null,
            image_url: 'https://example.com/fool.jpg',
            subTitle: '애정운',
            isReversed: false,
            interpretation: 'This is the interpretation text.',
          },
        ],
      };

      jest
        .spyOn(tarotsService, 'interpretTarotCards')
        .mockResolvedValue(interpretationsMock);

      const result = await tarotsController.interpretTarotCards(
        tarotInterpretationDto,
      );

      expect(result).toEqual(
        createResponse(200, 'successful', interpretationsMock),
      );
      expect(tarotsService.interpretTarotCards).toHaveBeenCalledWith(
        tarotInterpretationDto,
      );
    });
  });

  describe('saveTarotCards', () => {
    it('카드 저장', async () => {
      const req = { user: { userId: 1 } } as Request;
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

      const savedCardsMock = [
        {
          id: 1,
          card_id: 1,
          main_title: '오늘의 타로',
          sub_title: '애정운',
          user_id: 1,
          is_upright: true,
          created_at: new Date(),
          updated_at: new Date(),
          card_interpretation: 'Sample interpretation',
          card: { id: 1, name: 'The Fool' } as TarotCardsEntity,
          mainTitle: {
            id: 1,
            title: '오늘의 타로',
          } as SaveTarotMainTitleEntity,
          user: req.user as UsersEntity,
        } as unknown as SavedUserTarotCardsEntity,
      ];

      jest
        .spyOn(tarotsService, 'saveTarotCards')
        .mockResolvedValue({ savedCards: savedCardsMock });

      const result = await tarotsController.saveTarotCards(
        req,
        saveTarotCardDto,
      );

      expect(result).toEqual(
        createResponse(200, 'Successful', {
          savedCards: savedCardsMock,
        }),
      );
      expect(tarotsService.saveTarotCards).toHaveBeenCalledWith(
        1,
        saveTarotCardDto,
      );
    });
  });

  describe('cancelSavedTarotCard', () => {
    it('타로카드 저장 취소', async () => {
      const req = { user: { userId: 1 } } as Request;
      const savedCardId = 1;
      jest
        .spyOn(tarotsService, 'cancelSavedTarotCard')
        .mockResolvedValue('Successful');

      const result = await tarotsController.cancelSavedTarotCard(
        req,
        savedCardId,
      );

      expect(result).toEqual(createResponse(200, 'Successful'));
      expect(tarotsService.cancelSavedTarotCard).toHaveBeenCalledWith(
        req.user.userId,
        savedCardId,
      );
    });
  });
});
