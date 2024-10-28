import { Test, TestingModule } from '@nestjs/testing';
import { NamingsService } from './namings.service';

describe('NamingsService', () => {
  let service: NamingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NamingsService],
    }).compile();

    service = module.get<NamingsService>(NamingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
