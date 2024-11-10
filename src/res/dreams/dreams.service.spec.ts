import { Test, TestingModule } from '@nestjs/testing';
import { DreamsService } from './dreams.service';
import { OpenaiService } from '../openai/openai.service';
import { Repository } from 'typeorm';
import { SavedDreamInterpretationEntity } from './entities/saved_dream_interpretation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DreamsService', () => {
  let dreamsService: DreamsService;
  let savedDreamInterpretationRepository: Repository<SavedDreamInterpretationEntity>;
  let openaiService: OpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DreamsService,
        {
          provide: getRepositoryToken(SavedDreamInterpretationEntity),
          useClass: Repository,
        },
        {
          provide: OpenaiService,
          useValue: {
            getDreamInterpretation: jest
              .fn()
              .mockResolvedValue('Sample Interpretation'),
          },
        },
      ],
    }).compile();

    dreamsService = module.get<DreamsService>(DreamsService);
    savedDreamInterpretationRepository = module.get<
      Repository<SavedDreamInterpretationEntity>
    >(getRepositoryToken(SavedDreamInterpretationEntity));
    openaiService = module.get<OpenaiService>(OpenaiService);
  });

  describe('interpretDream', () => {
    it('꿈해몽 해석', async () => {
      const title = '사람/행동';
      const description = '오늘 꿈에서 여사친이 고백을 했어 나한테!';

      const result = await dreamsService.interpretDream(title, description);
      expect(openaiService.getDreamInterpretation).toHaveBeenCalledWith(
        title,
        description,
      );
      expect(result).toEqual({ interpretation: 'Sample Interpretation' });
    });
  });

  describe('saveInterpretedDream', () => {
    it('꿈 해몽 저장', async () => {
      const userId = 1;
      const mainTitle = '꿈 제목';
      const userDescription = '사용자 설명';
      const aiInterpretation = 'AI 해몽';

      const mockSavedDream = {
        id: 1,
        title: mainTitle,
        user_description: userDescription,
        description: aiInterpretation,
        user: { id: userId },
      } as SavedDreamInterpretationEntity;

      jest
        .spyOn(savedDreamInterpretationRepository, 'create')
        .mockReturnValue(mockSavedDream);
      jest
        .spyOn(savedDreamInterpretationRepository, 'save')
        .mockResolvedValue(mockSavedDream);

      const result = await dreamsService.saveInterpretedDream(
        userId,
        mainTitle,
        userDescription,
        aiInterpretation,
      );

      expect(result).toEqual({ savedDreamInterpretation: mockSavedDream });
      expect(savedDreamInterpretationRepository.create).toHaveBeenCalledWith({
        title: mainTitle,
        user_description: userDescription,
        description: aiInterpretation,
        user: { id: userId },
      });
      expect(savedDreamInterpretationRepository.save).toHaveBeenCalledWith(
        mockSavedDream,
      );
    });
  });

  describe('cancelSavedDreamInterpretation', () => {
    it('꿈해몽 저장 취소', async () => {
      const userId = 1;
      const savedDreamInterpretationId = 1;

      const mockSavedDream = {
        id: savedDreamInterpretationId,
        title: '꿈 제목',
        user_description: '사용자 설명',
        description: 'AI 해몽',
        user: { id: userId },
      } as SavedDreamInterpretationEntity;

      jest
        .spyOn(savedDreamInterpretationRepository, 'findOne')
        .mockResolvedValue(mockSavedDream);
      jest
        .spyOn(savedDreamInterpretationRepository, 'remove')
        .mockResolvedValue(mockSavedDream);

      const result = await dreamsService.cancelSavedDreamInterpretation(
        userId,
        savedDreamInterpretationId,
      );

      expect(result).toEqual({ savedDreamInterpretation: mockSavedDream });
      expect(savedDreamInterpretationRepository.findOne).toHaveBeenCalledWith({
        where: { id: savedDreamInterpretationId, user: { id: userId } },
      });
      expect(savedDreamInterpretationRepository.remove).toHaveBeenCalledWith(
        mockSavedDream,
      );
    });
  });
});
