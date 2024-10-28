import { Test, TestingModule } from '@nestjs/testing';
import { FortunesService } from './fortunes.service';

describe('FortunesService', () => {
  let service: FortunesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FortunesService],
    }).compile();

    service = module.get<FortunesService>(FortunesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
