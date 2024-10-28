import { Test, TestingModule } from '@nestjs/testing';
import { TarotsService } from './tarots.service';

describe('TarotsService', () => {
  let service: TarotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TarotsService],
    }).compile();

    service = module.get<TarotsService>(TarotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
