import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { openaiConfig } from '@/src/config/openai.config';

describe('OpenaiService', () => {
  let service: OpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiService,
        {
          provide: openaiConfig.KEY,
          useValue: {
            OPENAI_API_KEY: 'test-api-key',
          },
        },
      ],
    })
      .overrideProvider(OpenaiService)
      .useValue({
        getTarotCardInterpretation: jest
          .fn()
          .mockResolvedValue(
            'Interpretation of the tarot card in JSON format.',
          ),
        getNaming: jest
          .fn()
          .mockResolvedValue(
            '{ "name": "김아름", "description": "순수 한국 성함" }',
          ),
      })
      .compile();

    service = module.get<OpenaiService>(OpenaiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTarotCardInterpretation', () => {
    it('should return tarot card interpretation', async () => {
      const result = await service.getTarotCardInterpretation(
        'The Fool',
        'New beginnings',
        '연애운',
      );

      expect(result).toBe('Interpretation of the tarot card in JSON format.');
    });
  });

  describe('getNaming', () => {
    it('should return naming suggestion based on content and mainTitle', async () => {
      const result = await service.getNaming(
        '사람',
        '아버지 성함이 김아아입니다. 아들을 위한 이름 추천',
      );

      expect(result).toBe(
        '{ "name": "김아름", "description": "순수 한국 성함" }',
      );
    });
  });
});
