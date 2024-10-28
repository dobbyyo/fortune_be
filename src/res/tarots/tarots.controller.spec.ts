import { Test, TestingModule } from '@nestjs/testing';
import { TarotsController } from './tarots.controller';
import { TarotsService } from './tarots.service';

describe('TarotsController', () => {
  let controller: TarotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarotsController],
      providers: [TarotsService],
    }).compile();

    controller = module.get<TarotsController>(TarotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
