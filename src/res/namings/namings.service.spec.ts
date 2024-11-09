import { Test, TestingModule } from '@nestjs/testing';
import { NamingsService } from './namings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NamingEntity } from './entities/naming.entity';
import { SavedNamingEntity } from './entities/saved_naming.entity';
import { OpenaiService } from '../openai/openai.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('NamingsService', () => {
  let service: NamingsService;
  let namingRepository: Repository<NamingEntity>;
  let savedNamingRepository: Repository<SavedNamingEntity>;
  let openaiService: OpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NamingsService,
        {
          provide: getRepositoryToken(NamingEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SavedNamingEntity),
          useClass: Repository,
        },
        {
          provide: OpenaiService,
          useValue: { getNaming: jest.fn().mockResolvedValue('Sample Name') },
        },
      ],
    }).compile();

    service = module.get<NamingsService>(NamingsService);
    namingRepository = module.get<Repository<NamingEntity>>(
      getRepositoryToken(NamingEntity),
    );
    savedNamingRepository = module.get<Repository<SavedNamingEntity>>(
      getRepositoryToken(SavedNamingEntity),
    );
    openaiService = module.get<OpenaiService>(OpenaiService);
  });

  describe('drawNaming', () => {
    it('openai를 이용한 작명', async () => {
      const mainTitle = '사람';
      const content = '김씨 성의 이름을 추천해줘';

      const result = await service.drawNaming(mainTitle, content);
      expect(openaiService.getNaming).toHaveBeenCalledWith(mainTitle, content);
      expect(result).toEqual({ naming: 'Sample Name' });
    });
  });

  describe('saveNaming', () => {
    it('작명 저장', async () => {
      const userId = 1;
      const mainTitle = '사람';
      const namings = [{ name: '김철수', description: '성실하고 강직한 사람' }];
      const mockNamingEntity = { id: 1, mainTitle, date: new Date() };
      const mockSavedNaming = {
        id: 1,
        name: '김철수',
        description: '성실하고 강직한 사람',
      };

      jest.spyOn(namingRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(namingRepository, 'create')
        .mockReturnValue(mockNamingEntity as NamingEntity);
      jest
        .spyOn(namingRepository, 'save')
        .mockResolvedValue(mockNamingEntity as NamingEntity);
      jest
        .spyOn(savedNamingRepository, 'create')
        .mockReturnValue(mockSavedNaming as SavedNamingEntity);
      jest
        .spyOn(savedNamingRepository, 'save')
        .mockResolvedValue(mockSavedNaming as SavedNamingEntity);

      const result = await service.saveNaming(userId, mainTitle, namings);

      expect(result).toEqual({ savedNamings: [mockSavedNaming] });
      expect(namingRepository.findOne).toHaveBeenCalledWith({
        where: { mainTitle, date: expect.any(Date) },
      });
      expect(namingRepository.save).toHaveBeenCalledWith(mockNamingEntity);
      expect(savedNamingRepository.save).toHaveBeenCalled();
    });
  });

  describe('cancelSavedNaming', () => {
    it('작명 취소', async () => {
      const userId = 1;
      const savedNamingId = 1;
      const mockSavedNaming = {
        id: savedNamingId,
        naming: { id: 2 },
      } as SavedNamingEntity;

      jest
        .spyOn(savedNamingRepository, 'findOne')
        .mockResolvedValue(mockSavedNaming);
      jest
        .spyOn(savedNamingRepository, 'remove')
        .mockResolvedValue(mockSavedNaming);
      jest.spyOn(namingRepository, 'delete').mockResolvedValue(undefined);

      const result = await service.cancelSavedNaming(userId, savedNamingId);

      expect(result).toBe('Successful');
      expect(savedNamingRepository.findOne).toHaveBeenCalledWith({
        where: { id: savedNamingId, user: { id: userId } },
      });
      expect(savedNamingRepository.remove).toHaveBeenCalledWith(
        mockSavedNaming,
      );
    });

    it('작명 id 없을 시 에러 발생', async () => {
      const userId = 1;
      const savedNamingId = 999;

      jest.spyOn(savedNamingRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.cancelSavedNaming(userId, savedNamingId),
      ).rejects.toThrow(
        new NotFoundException(`${savedNamingId}를 찾을 수 없습니다.`),
      );
    });
  });
});
