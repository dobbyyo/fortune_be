import { Test, TestingModule } from '@nestjs/testing';
import { TarotsController } from './tarots.controller';
import { TarotsService } from './tarots.service';
import { DrawTarotDto } from './dto/draw-tarot.dto';
import { BadRequestException } from '@nestjs/common';

describe('TarotsController', () => {
  let tarotsController: TarotsController;
  let tarotsService: TarotsService;

  const mockTarotCard = {
    id: 1,
    name: 'The Fool',
    type: 'Major',
    number: 0,
    suit: null,
    image_url: 'https://example.com/fool.jpg',
    upright_meaning: 'New beginnings',
    reversed_meaning: 'Recklessness',
    subTitle: '애정운',
    isReversed: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarotsController],
      providers: [
        {
          provide: TarotsService,
          useValue: {
            drawTarot: jest
              .fn()
              .mockResolvedValue({ tarotCards: [mockTarotCard] }),
          },
        },
      ],
    }).compile();

    tarotsController = module.get<TarotsController>(TarotsController);
    tarotsService = module.get<TarotsService>(TarotsService);
  });

  it('should be defined', () => {
    expect(tarotsController).toBeDefined();
  });

  describe('drawTarot', () => {
    it('mainTitle에 맞는 타롯카드 데이터 호출', async () => {
      const drawTarotDto: DrawTarotDto = { mainTitle: '오늘의 타로' };
      const result = await tarotsController.drawTarot(drawTarotDto);

      expect(result).toEqual({
        status: 200,
        message: 'successful',
        data: { tarotCards: [mockTarotCard] },
      });
      expect(tarotsService.drawTarot).toHaveBeenCalledWith('오늘의 타로');
    });

    it('없는 타이틀 경우 에러 발생', async () => {
      const drawTarotDto: DrawTarotDto = { mainTitle: '잘못된 타이틀' };
      jest
        .spyOn(tarotsService, 'drawTarot')
        .mockRejectedValue(new BadRequestException('Invalid main title'));

      await expect(tarotsController.drawTarot(drawTarotDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
