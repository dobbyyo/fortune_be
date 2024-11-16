import { Test, TestingModule } from '@nestjs/testing';
import { FortunesController } from './fortunes.controller';
import { FortunesService } from './fortunes.service';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { createResponse } from '@/src/utils/create-response.util';
import {
  SaveFortunesDto,
  SaveStarSignDto,
  SaveZodiacDto,
} from './dto/save-today-fortunes.dto';
import { SavedSandbarsEntity } from './entities/saved_sandbars.entity';

describe('FortunesController', () => {
  let fortunesController: FortunesController;
  let fortunesService: FortunesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FortunesController],
      providers: [
        {
          provide: FortunesService,
          useValue: {
            getTodayForunes: jest.fn(),
            getTodayForunesExplanation: jest.fn(),
            getZodiacFortunes: jest.fn(),
            getConstellationFortunes: jest.fn(),
            saveFortunes: jest.fn(),
            deleteSandbar: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    fortunesController = module.get<FortunesController>(FortunesController);
    fortunesService = module.get<FortunesService>(FortunesService);
  });

  describe('getTodayFortunes', () => {
    it('오늘의 운세 뽑기', async () => {
      const req = {
        user: { userId: 1, birth_date: '1990-01-01', birth_time: '12:00' },
      } as any;
      const query = { userId: 1 };
      const mockResponse = { fortunesData: 'Today fortunes data' };

      jest
        .spyOn(fortunesService, 'getTodayForunes')
        .mockResolvedValue(mockResponse);

      const result = await fortunesController.getTodayFortunes(query, req);

      expect(result).toEqual(createResponse(200, 'successful', mockResponse));
      expect(fortunesService.getTodayForunes).toHaveBeenCalledWith(
        req.user,
        '1990-01-01',
        12,
        0,
      );
    });
  });

  describe('getExplanation', () => {
    it('오늘의 운세 AI 설명', async () => {
      const req = {
        user: { userId: 1, birth_date: '1990-01-01', birth_time: '12:30' },
      } as any;
      const query = { userId: 1 };
      const mockExplanationData = { explanationData: 'Explanation data' };

      jest
        .spyOn(fortunesService, 'getTodayForunesExplanation')
        .mockResolvedValue(mockExplanationData);

      const result = await fortunesController.getExplanation(query, req);

      expect(result).toEqual(
        createResponse(200, 'successful', mockExplanationData),
      );
      expect(fortunesService.getTodayForunesExplanation).toHaveBeenCalledWith(
        req.user,
        '1990-01-01',
        12,
        30,
      );
    });
  });

  describe('getZodiacFortunes', () => {
    it('띠자리 운세', async () => {
      const req = { user: { userId: 1, birth_date: '1990-01-01' } } as any;
      const query = { userId: 1 };
      const mockZodiacData = { zodiacFortune: 'Zodiac data' };

      jest
        .spyOn(fortunesService, 'getZodiacFortunes')
        .mockResolvedValue(mockZodiacData);

      const result = await fortunesController.getZodiacFortunes(query, req);

      expect(result).toEqual(createResponse(200, 'successful', mockZodiacData));
      expect(fortunesService.getZodiacFortunes).toHaveBeenCalledWith(
        '1990-01-01',
      );
    });
  });

  describe('getConstellationFortunes', () => {
    it('별자리 운세', async () => {
      const req = { user: { userId: 1, birth_date: '1990-01-01' } } as any;
      const query = { userId: 1 };
      const mockConstellationData = { constellation: 'Constellation data' };

      jest
        .spyOn(fortunesService, 'getConstellationFortunes')
        .mockResolvedValue(mockConstellationData);

      const result = await fortunesController.getConstellationFortunes(
        query,
        req,
      );

      expect(result).toEqual(
        createResponse(200, 'successful', mockConstellationData),
      );
      expect(fortunesService.getConstellationFortunes).toHaveBeenCalledWith(
        '1990-01-01',
      );
    });
  });

  describe('saveFortunes', () => {
    it('운세 저장', async () => {
      const req = { user: { userId: 1 } } as any;
      const body = {
        userId: 1,
        title: 'test',
        todaysFortune: {} as SaveFortunesDto,
        zodiacFortune: {} as SaveZodiacDto,
        starSignFortune: {} as SaveStarSignDto,
      };
      const mockSavedFortune = {
        savedSandbar: { id: 1, title: 'test' } as SavedSandbarsEntity,
      };

      jest
        .spyOn(fortunesService, 'saveFortunes')
        .mockResolvedValue(mockSavedFortune);

      const result = await fortunesController.saveFortunes(body, req);

      expect(result).toEqual(
        createResponse(200, 'successful', mockSavedFortune),
      );
      expect(fortunesService.saveFortunes).toHaveBeenCalledWith(body);
    });
  });

  describe('deleteSandbar', () => {
    it('운세 저장 취소', async () => {
      const req = { user: { userId: 1 } } as any;
      const query = { userId: 1, sandbarId: 1 };
      const mockDeletedResponse = 'sucess';

      jest
        .spyOn(fortunesService, 'deleteSandbar')
        .mockResolvedValue(mockDeletedResponse);

      const result = await fortunesController.deleteSandbar(query, req);

      expect(result).toEqual(
        createResponse(200, 'successful', mockDeletedResponse),
      );
      expect(fortunesService.deleteSandbar).toHaveBeenCalledWith(query);
    });
  });
});
