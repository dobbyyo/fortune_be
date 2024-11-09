import { Test, TestingModule } from '@nestjs/testing';
import { NamingsController } from './namings.controller';
import { NamingsService } from '@res/namings/namings.service';
import { DrawNamingDto } from './dto/draw-naming.dto';
import { SaveNamingDto } from './dto/save-naming.dto';
import { createResponse } from '@/src/utils/create-response.util';
import { Request } from 'express';

describe('NamingsController', () => {
  let namingsController: NamingsController;
  let namingsService: NamingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NamingsController],
      providers: [
        {
          provide: NamingsService,
          useValue: {
            drawNaming: jest.fn(),
            saveNaming: jest.fn(),
            cancelSavedNaming: jest.fn(),
          },
        },
      ],
    }).compile();

    namingsController = module.get<NamingsController>(NamingsController);
    namingsService = module.get<NamingsService>(NamingsService);
  });

  describe('drawNaming', () => {
    it('이름 작명 응답', async () => {
      const drawNamingDto: DrawNamingDto = {
        mainTitle: '사람',
        content: '아버지 성함이 김웅진이야, 아들이고 이름 지어줘 한자이름으로',
      };

      const namingCardsMock = {
        naming: JSON.stringify({
          name: '김호동',
          description: '아버지의 성과 관련 있는 한자 이름 추천',
        }),
      };

      jest
        .spyOn(namingsService, 'drawNaming')
        .mockResolvedValue(namingCardsMock);

      const result = await namingsController.drawNaming(drawNamingDto);
      expect(result).toEqual(
        createResponse(200, 'successful', namingCardsMock),
      );
      expect(namingsService.drawNaming).toHaveBeenCalledWith(
        decodeURIComponent(drawNamingDto.mainTitle),
        drawNamingDto.content,
      );
    });
  });

  describe('saveNaming', () => {
    it('작명 저장', async () => {
      const req = { user: { userId: 1 } } as Request;
      const saveNamingDto: SaveNamingDto = {
        mainTitle: '사람',
        namings: [
          {
            name: '김호동',
            description: '아버지의 성을 따른 한자 이름',
          },
        ],
      };

      jest.spyOn(namingsService, 'saveNaming').mockResolvedValue(undefined);

      const result = await namingsController.saveNaming(req, saveNamingDto);
      expect(result).toEqual(createResponse(200, 'successful'));
      expect(namingsService.saveNaming).toHaveBeenCalledWith(
        req.user.userId,
        saveNamingDto.mainTitle,
        saveNamingDto.namings,
      );
    });
  });

  describe('cancelSavedNaming', () => {
    it('작명 저장 취소', async () => {
      const req = { user: { userId: 1 } } as Request;
      const savedNamingId = 2;

      jest
        .spyOn(namingsService, 'cancelSavedNaming')
        .mockResolvedValue(undefined);

      const result = await namingsController.cancelSavedNaming(
        req,
        savedNamingId,
      );
      expect(result).toEqual(createResponse(200, 'successful'));
      expect(namingsService.cancelSavedNaming).toHaveBeenCalledWith(
        req.user.userId,
        savedNamingId,
      );
    });
  });
});
