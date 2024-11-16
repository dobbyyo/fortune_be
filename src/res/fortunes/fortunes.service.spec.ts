import { Test, TestingModule } from '@nestjs/testing';
import { FortunesService } from './fortunes.service';
import { RedisService } from '../redis/redis.service';
import { FortuneCalculationService } from './fortunes-calculation.service';
import { HeavenlyStemsEntity } from './entities/heavenly_stems.entity';
import { EarthlyBranchesEntity } from './entities/earthly_baranches.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ZodiacFortuneEntity } from './entities/zodiac_fortune.entity';
import { StarSignFortuneEntity } from './entities/star_sign_fortune.entity';
import { SavedFortunesEntity } from './entities/saved_fortunes.entity';
import { SavedStarEntity } from './entities/saved_star.entity';
import { SavedZodiacEntity } from './entities/saved_zodiac.entity';
import { SavedSandbarsEntity } from './entities/saved_sandbars.entity';
import { OpenaiService } from '../openai/openai.service';
import { Repository } from 'typeorm';
import { SaveSandbarDto } from './dto/save-today-fortunes.dto';
import { DeleteSandbarDto } from './dto/delete-sandbar.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('FortunesService', () => {
  let service: FortunesService;
  let redisService: RedisService;
  let openaiService: OpenaiService;
  let fortuneCalculationService: FortuneCalculationService;
  let zodiacFortuneRepository: Repository<ZodiacFortuneEntity>;
  let starSignFortuneRepository: Repository<StarSignFortuneEntity>;
  let sandbarRepository: jest.Mocked<Repository<SavedSandbarsEntity>>;
  let fortunesRepository: jest.Mocked<Repository<SavedFortunesEntity>>;
  let zodiacRepository: jest.Mocked<Repository<SavedZodiacEntity>>;
  let starRepository: jest.Mocked<Repository<SavedStarEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FortunesService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: FortuneCalculationService,
          useValue: {
            calculateFourPillars: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(HeavenlyStemsEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EarthlyBranchesEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ZodiacFortuneEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StarSignFortuneEntity),
          useValue: {
            findOne: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            }),
          },
        },
        {
          provide: getRepositoryToken(SavedFortunesEntity),
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SavedStarEntity),
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SavedZodiacEntity),
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SavedSandbarsEntity),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: OpenaiService,
          useValue: {
            getTodayFortunes: jest.fn(),
            getZodiacFortunes: jest.fn(),
            getConstellationFortunes: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FortunesService>(FortunesService);
    redisService = module.get<RedisService>(RedisService);
    fortuneCalculationService = module.get<FortuneCalculationService>(
      FortuneCalculationService,
    );
    openaiService = module.get<OpenaiService>(OpenaiService);
    zodiacFortuneRepository = module.get(
      getRepositoryToken(ZodiacFortuneEntity),
    );
    starSignFortuneRepository = module.get(
      getRepositoryToken(StarSignFortuneEntity),
    );
    sandbarRepository = module.get(getRepositoryToken(SavedSandbarsEntity));
    fortunesRepository = module.get(getRepositoryToken(SavedFortunesEntity));
    zodiacRepository = module.get(getRepositoryToken(SavedZodiacEntity));
    starRepository = module.get(getRepositoryToken(SavedStarEntity));
  });

  describe('getTodayForunes', () => {
    it('오늘의 운세 데이터가 레디스에 존재 시 호출', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValueOnce('cached data');
      const result = await service.getTodayForunes(
        { userId: 1 } as any,
        '1990-01-01',
        12,
        0,
      );
      expect(result).toEqual({ fortunesData: 'cached data' } as any);
    });

    it('오늘의 운세 데이터가 미 존재 시 디비 호출', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);

      jest
        .spyOn(fortuneCalculationService, 'calculateFourPillars')
        .mockResolvedValue({
          heavenly: {
            year: 'A',
            month: 'B',
            day: 'C',
            hour: 'D',
            elements: { year: '목', month: '화', day: '토', hour: '수' },
          },
          earthly: {
            year: 'I',
            month: 'J',
            day: 'K',
            hour: 'L',
            elements: { year: '목', month: '화', day: '금', hour: '수' },
          },
        } as unknown as ReturnType<
          FortuneCalculationService['calculateFourPillars']
        >);

      jest
        .spyOn(service, 'fetchDatabaseHeavenlyInfo' as any)
        .mockResolvedValue({
          year: 'imgA',
          month: 'imgB',
          day: 'imgC',
          hour: 'imgD',
        });

      jest.spyOn(service, 'fetchDatabaseEarthlyInfo' as any).mockResolvedValue({
        year: 'imgE',
        month: 'imgF',
        day: 'imgG',
        hour: 'imgH',
      });

      const result = await service.getTodayForunes(
        { userId: 1 } as any,
        '1990-01-01',
        12,
        0,
      );

      expect(result).toEqual({
        fortunesData: {
          heavenly: {
            year: 'A',
            month: 'B',
            day: 'C',
            hour: 'D',
            elements: {
              baseElements: { year: '목', month: '화', day: '토', hour: '수' },
              img: { year: 'imgA', month: 'imgB', day: 'imgC', hour: 'imgD' },
            },
          },
          earthly: {
            year: 'I',
            month: 'J',
            day: 'K',
            hour: 'L',
            elements: {
              baseElements: { year: '목', month: '화', day: '금', hour: '수' },
              img: { year: 'imgE', month: 'imgF', day: 'imgG', hour: 'imgH' },
            },
          },
        },
      });

      expect(redisService.set).toHaveBeenCalledWith(
        'fortunesData:1',
        {
          fortunesData: {
            heavenly: expect.any(Object),
            earthly: expect.any(Object),
          },
        },
        3600,
      );
    }, 10000);
  });

  describe('getTodayForunesExplanation', () => {
    it('레디스에 운세 데이터가 존재 시 호출하여 AI 해석', async () => {
      const userData = { userId: 1 } as any;
      const redisKey = `fortunesData:${userData.userId}`;
      const cachedFortunes = { fortunesData: 'cached fortunes' };
      const mockExplanation = { explanation: 'test explanation' };

      jest.spyOn(redisService, 'get').mockResolvedValueOnce(cachedFortunes);
      jest
        .spyOn(openaiService, 'getTodayFortunes')
        .mockResolvedValueOnce(mockExplanation);

      const result = await service.getTodayForunesExplanation(
        userData,
        '1990-01-01',
        2,
        0,
      );

      expect(redisService.get).toHaveBeenCalledWith(redisKey);
      expect(openaiService.getTodayFortunes).toHaveBeenCalledWith(
        cachedFortunes as any,
      );
      expect(result).toEqual({ explanationData: mockExplanation });
    });

    it('레디스에 운세 미 존재 시 생성하여 AI 해석', async () => {
      const userData = { userId: 1 } as any;
      const redisKey = `fortunesData:${userData.userId}`;
      const newFortunes = { fortunesData: 'newly calculated fortunes' };
      const mockExplanation = { explanation: 'test explanation' };

      jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
      jest
        .spyOn(service, 'getTodayForunes')
        .mockResolvedValueOnce(newFortunes as any);
      jest
        .spyOn(openaiService, 'getTodayFortunes')
        .mockResolvedValueOnce(mockExplanation);

      const result = await service.getTodayForunesExplanation(
        userData,
        '1990-01-01',
        12,
        0,
      );

      expect(redisService.get).toHaveBeenCalledWith(redisKey);
      expect(service.getTodayForunes).toHaveBeenCalledWith(
        userData,
        '1990-01-01',
        12,
        0,
      );
      expect(redisService.set).toHaveBeenCalledWith(
        redisKey,
        newFortunes,
        3600,
      );
      expect(openaiService.getTodayFortunes).toHaveBeenCalledWith(
        newFortunes as any,
      );
      expect(result).toEqual({ explanationData: mockExplanation });
    });
  });

  describe('getZodiacFortunes', () => {
    it('띠 운세', async () => {
      const mockBirthDate = '1990-01-01';
      const mockYear = 1990;
      const mockZodiacFortune = {
        id: 1,
        name: 'test fortune',
        rest: 6,
      } as ZodiacFortuneEntity;
      const mockAiResponse = { aiFortune: 'AI generated fortune' };
      const mockResponse = {
        zodiacFortune: { ...mockZodiacFortune, ...mockAiResponse },
      };

      jest
        .spyOn(zodiacFortuneRepository, 'findOne')
        .mockResolvedValueOnce(mockZodiacFortune);
      jest
        .spyOn(openaiService, 'getZodiacFortunes')
        .mockResolvedValueOnce(mockAiResponse);

      const result = await service.getZodiacFortunes(mockBirthDate);

      expect(zodiacFortuneRepository.findOne).toHaveBeenCalledWith({
        where: [
          {
            rest: mockYear % 12,
            cycle: 12,
          },
        ],
      });
      expect(openaiService.getZodiacFortunes).toHaveBeenCalledWith(
        mockZodiacFortune,
        2024,
      );
      expect(result).toEqual(mockResponse);
    });

    it('띠 운세 미 존재시', async () => {
      const mockBirthDate = '1990';

      jest
        .spyOn(zodiacFortuneRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(service.getZodiacFortunes(mockBirthDate)).rejects.toThrow(
        '해당 연도에 맞는 띠 운세가 없습니다.',
      );
      expect(zodiacFortuneRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('getConstellationFortunes', () => {
    it('별자리 운세', async () => {
      const mockBirthDate = '1990-01-15';
      const mockConstellation = {
        id: 1,
        name: 'Capricorn',
        start_date: '12.22',
        end_date: '01.19',
        image_url: 'image url',
      };
      const mockAiResponse = { aiFortune: 'AI generated fortune' };
      const mockResponse = {
        constellation: { ...mockConstellation, ...mockAiResponse },
      };

      jest
        .spyOn(starSignFortuneRepository.createQueryBuilder(), 'getOne')
        .mockResolvedValueOnce(mockConstellation);
      jest
        .spyOn(openaiService, 'getConstellationFortunes')
        .mockResolvedValueOnce(mockAiResponse);

      const result = await service.getConstellationFortunes(mockBirthDate);

      expect(starSignFortuneRepository.createQueryBuilder).toHaveBeenCalled();
      expect(openaiService.getConstellationFortunes).toHaveBeenCalledWith(
        mockConstellation,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('saveFortunes', () => {
    it('오늘의 운세 저장', async () => {
      const saveSandbarDto: SaveSandbarDto = {
        userId: 1,
        title: 'Test Sandbar',
        todaysFortune: { data: 'todays fortune data' } as any,
        zodiacFortune: { data: 'zodiac fortune data' } as any,
        starSignFortune: { data: 'star sign fortune data' } as any,
      };

      const savedTodaysFortune = {
        id: 1,
        total_fortune_title: 'todays fortune data',
      } as SavedFortunesEntity;
      const savedZodiac = {
        id: 2,
        zodiac_title: 'zodiac fortune data',
      } as SavedZodiacEntity;
      const savedStarSign = {
        id: 3,
        star_sign: 'star sign fortune data',
      } as SavedStarEntity;

      const savedSandbar = {
        id: 4,
        user_id: saveSandbarDto.userId,
        title: saveSandbarDto.title,
        todays_fortune_id: savedTodaysFortune.id,
        zodiac_fortune_id: savedZodiac.id,
        star_sign_fortune_id: savedStarSign.id,
      } as SavedSandbarsEntity;

      jest
        .spyOn(fortunesRepository, 'save')
        .mockResolvedValueOnce(savedTodaysFortune);
      jest.spyOn(zodiacRepository, 'save').mockResolvedValueOnce(savedZodiac);
      jest.spyOn(starRepository, 'save').mockResolvedValueOnce(savedStarSign);
      jest.spyOn(sandbarRepository, 'create').mockReturnValue(savedSandbar);
      jest.spyOn(sandbarRepository, 'save').mockResolvedValueOnce(savedSandbar);

      const result = await service.saveFortunes(saveSandbarDto);

      expect(fortunesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ data: 'todays fortune data' }),
      );
      expect(zodiacRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ data: 'zodiac fortune data' }),
      );
      expect(starRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ data: 'star sign fortune data' }),
      );
      expect(sandbarRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 1,
          title: 'Test Sandbar',
          todays_fortune_id: 1,
          zodiac_fortune_id: 2,
          star_sign_fortune_id: 3,
        }),
      );
      expect(sandbarRepository.save).toHaveBeenCalledWith(savedSandbar);

      expect(result).toEqual({ savedSandbar });
    });
  });

  describe('deleteSandbar', () => {
    it('사주 저장한 것들 연관 삭제', async () => {
      const deleteSandbarDto: DeleteSandbarDto = { sandbarId: 1, userId: 1 };

      const mockSavedSandbar = {
        id: 1,
        user_id: 1,
        todays_fortune_id: 101,
        zodiac_fortune_id: 201,
        star_sign_fortune_id: 301,
      } as SavedSandbarsEntity;

      jest
        .spyOn(sandbarRepository, 'findOne')
        .mockResolvedValueOnce(mockSavedSandbar);
      jest.spyOn(fortunesRepository, 'delete').mockResolvedValueOnce(null);
      jest.spyOn(zodiacRepository, 'delete').mockResolvedValueOnce(null);
      jest.spyOn(starRepository, 'delete').mockResolvedValueOnce(null);
      jest.spyOn(sandbarRepository, 'delete').mockResolvedValueOnce(null);

      const result = await service.deleteSandbar(deleteSandbarDto);

      expect(sandbarRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: deleteSandbarDto.sandbarId,
          user_id: deleteSandbarDto.userId,
        },
      });
      expect(fortunesRepository.delete).toHaveBeenCalledWith(
        mockSavedSandbar.todays_fortune_id,
      );
      expect(zodiacRepository.delete).toHaveBeenCalledWith(
        mockSavedSandbar.zodiac_fortune_id,
      );
      expect(starRepository.delete).toHaveBeenCalledWith(
        mockSavedSandbar.star_sign_fortune_id,
      );
      expect(sandbarRepository.delete).toHaveBeenCalledWith({
        id: deleteSandbarDto.sandbarId,
        user_id: deleteSandbarDto.userId,
      });
      expect(result).toEqual('Successfully');
    });

    it('savedSandbar가 미 존재 시 에러 발생', async () => {
      const deleteSandbarDto: DeleteSandbarDto = { sandbarId: 1, userId: 1 };

      jest.spyOn(sandbarRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.deleteSandbar(deleteSandbarDto)).rejects.toThrow(
        new NotFoundException('해당 사주 정보가 없습니다.'),
      );
    });

    it('should throw ForbiddenException if userId does not match', async () => {
      const deleteSandbarDto: DeleteSandbarDto = { sandbarId: 1, userId: 2 };

      const mockSavedSandbar = {
        id: 1,
        user_id: 1,
        todays_fortune_id: 101,
        zodiac_fortune_id: 201,
        star_sign_fortune_id: 301,
      } as SavedSandbarsEntity;

      jest
        .spyOn(sandbarRepository, 'findOne')
        .mockResolvedValueOnce(mockSavedSandbar);

      await expect(service.deleteSandbar(deleteSandbarDto)).rejects.toThrow(
        new ForbiddenException('사용자 정보가 일치하지 않습니다.'),
      );
    });
  });
});
