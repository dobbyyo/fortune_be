import { Test, TestingModule } from '@nestjs/testing';
import { NamingsController } from './namings.controller';
import { NamingsService } from './namings.service';

describe('NamingsController', () => {
  let controller: NamingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NamingsController],
      providers: [NamingsService],
    }).compile();

    controller = module.get<NamingsController>(NamingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
