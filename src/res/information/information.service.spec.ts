import { Test, TestingModule } from '@nestjs/testing';
import { InformationService } from './information.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetInformationDto } from './dto/get-information.dto';
import { BadRequestException } from '@nestjs/common';
import { WebInformationEntity } from './entities/web_information.entity';

const mockInformationRepository = {
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([
      {
        id: 1,
        created_at: new Date('2024-11-07T03:58:42.590Z'),
        updated_at: new Date('2024-11-07T03:58:42.590Z'),
        deleted_at: null,
        title: '공지 테스트',
        content: '테스트 내용 테스트 내용테스트 내용테스트 내용테스트 내용',
      },
    ]),
  })),
};

describe('InformationService', () => {
  let informationService: InformationService;
  let informationRepository: Repository<WebInformationEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InformationService,
        {
          provide: getRepositoryToken(WebInformationEntity),
          useValue: mockInformationRepository,
        },
      ],
    }).compile();

    informationService = module.get<InformationService>(InformationService);
    informationRepository = module.get<Repository<WebInformationEntity>>(
      getRepositoryToken(WebInformationEntity),
    );
  });

  it('should be defined', () => {
    expect(informationService).toBeDefined();
  });

  describe('getInformation', () => {
    it('공지사항 가져오기', async () => {
      const query: GetInformationDto = {
        start_date: '2024-11-01',
        end_date: '2024-11-30',
        page: 1,
        limit: 10,
      };

      const result = await informationService.getInformation(query);

      expect(result).toEqual({
        information: [
          {
            id: 1,
            created_at: new Date('2024-11-07T03:58:42.590Z'),
            updated_at: new Date('2024-11-07T03:58:42.590Z'),
            deleted_at: null,
            title: '공지 테스트',
            content: '테스트 내용 테스트 내용테스트 내용테스트 내용테스트 내용',
          },
        ],
      });
    });

    it('잘못된 DTO로 보낼경우 에러 발생', async () => {
      const query: GetInformationDto = {
        start_date: 'invalid-date',
        end_date: '2024-11-30',
        page: 1,
        limit: 10,
      };

      await expect(informationService.getInformation(query)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
