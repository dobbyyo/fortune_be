import { Test, TestingModule } from '@nestjs/testing';
import { DreamsController } from './dreams.controller';
import { DreamsService } from './dreams.service';
import { InterpretDreamDto } from './dto/interpret-dream.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { Request } from 'express';

describe('DreamsController', () => {
  let dreamsController: DreamsController;
  let dreamsService: DreamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DreamsController],
      providers: [
        {
          provide: DreamsService,
          useValue: {
            interpretDream: jest.fn(),
            saveInterpretedDream: jest.fn(),
            cancelSavedDreamInterpretation: jest.fn(),
          },
        },
      ],
    }).compile();

    dreamsController = module.get<DreamsController>(DreamsController);
    dreamsService = module.get<DreamsService>(DreamsService);
  });

  describe('interpretDream', () => {
    it('꿈 해몽 응답', async () => {
      const interpretDreamDto: InterpretDreamDto = {
        title: '사람/행동',
        description: '오늘 꿈에서 여사친이 고백을 했어 나한테!',
      };

      const interpretationMock = {
        interpretation: JSON.stringify({
          name: '사랑/행동',
          description: '이러한 행동은 어쩌고 저쩌고 사랑이 이루어지겠어요~',
        }),
      };

      jest
        .spyOn(dreamsService, 'interpretDream')
        .mockResolvedValue(interpretationMock);

      const result = await dreamsController.interpretDream(interpretDreamDto);

      expect(result).toEqual(
        createResponse(200, 'successful', interpretationMock),
      );

      expect(dreamsService.interpretDream).toHaveBeenCalledWith(
        decodeURIComponent(interpretDreamDto.title),
        interpretDreamDto.description,
      );
    });
  });

  describe('saveInterpretedDream', () => {
    const req = { user: { userId: 1 } } as Request;

    it('꿈 해몽 저장', async () => {
      const saveInterpretedDreamDto = {
        mainTitle: '사람/행동',
        user_description: '오늘 꿈에서 여사친이 고백을 했어 나한테!',
        ai_interpretation: '이러한 행동은 어쩌고 저쩌고 사랑이 이루어지겠어요~',
      };

      jest
        .spyOn(dreamsService, 'saveInterpretedDream')
        .mockResolvedValue(undefined);

      const result = await dreamsController.saveInterpretedDream(
        req,
        saveInterpretedDreamDto,
      );
      expect(result).toEqual(createResponse(200, 'successful'));
      expect(dreamsService.saveInterpretedDream).toHaveBeenCalledWith(
        req.user.userId,
        saveInterpretedDreamDto.mainTitle,
        saveInterpretedDreamDto.user_description,
        saveInterpretedDreamDto.ai_interpretation,
      );
    });
  });

  describe('cancelSavedDreamInterpretation', () => {
    it('꿈 해몽 저장 취소', async () => {
      const req = { user: { userId: 1 } } as Request;
      const savedDreamInterpretationId = 1;

      jest
        .spyOn(dreamsService, 'cancelSavedDreamInterpretation')
        .mockResolvedValue(undefined);

      const result = await dreamsController.cancelSavedDreamInterpretation(
        req,
        savedDreamInterpretationId,
      );
      expect(result).toEqual(createResponse(200, 'successful'));
      expect(dreamsService.cancelSavedDreamInterpretation).toHaveBeenCalledWith(
        req.user.userId,
        savedDreamInterpretationId,
      );
    });
  });
});
