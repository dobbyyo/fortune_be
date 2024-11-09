import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from './entities/users.entity';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { UsersLanguageEntity } from './entities/users_language.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUser: UsersEntity = {
    id: 1,
    email: 'test@example.com',
    username: '홍길동',
    birth_date: new Date('2022-01-01'),
    birth_time: '12:00:00',
    gender: 'MAN',
  } as UsersEntity;

  const mockLanguageUser: UsersLanguageEntity = {
    user_id: 1,
    language: 'ENGLISH',
    user: { id: 1, email: 'test@example.com' } as UsersEntity,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(mockUser),
            updateMyInfo: jest.fn().mockResolvedValue(mockUser),
            updateLanguage: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { email: 'test@example.com' };
          return true;
        },
      })
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getMyInfo', () => {
    it('인증된 유저 정보 가져오기', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue({ myInfo: mockUser });

      const result = await usersController.getMyInfo({
        user: { email: 'test@example.com' },
      } as any);

      expect(result).toEqual({
        status: 200,
        message: 'successful',
        data: { myInfo: mockUser },
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('updateMyInfo', () => {
    it('유저 업데이트', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'Updated Name',
        birth_date: new Date('2023-01-01'),
        birth_time: '10:00:00',
        gender: 'WOMAN',
      };

      jest
        .spyOn(usersService, 'updateMyInfo')
        .mockResolvedValue({ myInfo: mockUser });

      const result = await usersController.updateMyInfo(
        { user: { email: 'test@example.com' } } as any,
        updateUserDto,
      );

      expect(result).toEqual({
        status: 200,
        message: 'successful',
        data: { myInfo: mockUser },
      });
      expect(usersService.updateMyInfo).toHaveBeenCalledWith(
        'test@example.com',
        updateUserDto,
      );
    });
  });

  describe('updateLanguage', () => {
    it('유저 언어 업데이트', async () => {
      const updateLanguageDto: UpdateLanguageDto = { language: 'ENGLISH' };

      jest
        .spyOn(usersService, 'updateLanguage')
        .mockResolvedValue({ myInfo: mockLanguageUser });

      const result = await usersController.updateLanguage(
        { user: { email: 'test@example.com' } } as any,
        updateLanguageDto,
      );

      expect(result).toEqual({
        status: 200,
        message: 'successful',
        data: { myInfo: mockLanguageUser },
      });
      expect(usersService.updateLanguage).toHaveBeenCalledWith(
        'test@example.com',
        updateLanguageDto,
      );
    });
  });
});
