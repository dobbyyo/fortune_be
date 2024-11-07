import { Test, TestingModule } from '@nestjs/testing';
import { InformationController } from './information.controller';
import { InformationService } from './information.service';
import { GetInformationDto } from './dto/get-information.dto';

describe('InformationController', () => {
  let informationController: InformationController;
  let informationService: InformationService;

  const mockInformation = [
    {
      id: 1,
      created_at: new Date('2024-11-07T03:58:42.590Z'),
      updated_at: new Date('2024-11-07T03:58:42.590Z'),
      deleted_at: null,
      title: '공지 테스트',
      content: '테스트 내용 테스트 내용테스트 내용테스트 내용테스트 내용',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformationController],
      providers: [
        {
          provide: InformationService,
          useValue: {
            getInformation: jest
              .fn()
              .mockResolvedValue({ information: mockInformation }),
          },
        },
      ],
    }).compile();

    informationController = module.get<InformationController>(
      InformationController,
    );
    informationService = module.get<InformationService>(InformationService);
  });

  it('should be defined', () => {
    expect(informationController).toBeDefined();
  });

  describe('getInformation', () => {
    it('공지사항 가져오기', async () => {
      const query: GetInformationDto = {
        start_date: '2024-11-01',
        end_date: '2024-11-30',
        page: 1,
        limit: 10,
      };

      const result = await informationController.getInformation(query);

      expect(result).toEqual({
        status: 200,
        message: 'successful',
        data: { information: mockInformation },
      });
      expect(informationService.getInformation).toHaveBeenCalledWith(query);
    });
  });
});
