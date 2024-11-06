import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersLanguageEntity } from './entities/users_language.entity';
import { UsersEntity } from './entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<UsersEntity>;
  let usersLanguageRepository: Repository<UsersLanguageEntity>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: '홍길동',
    birth_date: new Date('2022-01-01'),
    birth_time: '12:00:00',
    gender: 'MAN',
  } as UsersEntity;

  const mockLanguage: UsersLanguageEntity = {
    user_id: 1,
    language: 'KOREAN',
    user: mockUser,
  } as UsersLanguageEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UsersLanguageEntity),
          useValue: {
            update: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn().mockImplementation((fn) => fn()), // transaction 더미 구현
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );
    usersLanguageRepository = module.get<Repository<UsersLanguageEntity>>(
      getRepositoryToken(UsersLanguageEntity),
    );
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findByEmail', () => {
    it('유저 정보 및 관련 데이터 호출', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await usersService.findByEmail('test@example.com');

      expect(result).toEqual({ myInfo: mockUser });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        relations: ['language', 'notification', 'profile', 'password'],
      });
    });
  });

  describe('updateMyInfo', () => {
    it('유저 정보를 업데이트합니다.', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'Updated Name',
        birth_date: new Date('2023-01-01'),
        birth_time: '10:00:00',
        gender: 'WOMAN',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await usersService.updateMyInfo(
        'test@example.com',
        updateUserDto,
      );

      expect(result).toEqual({ myInfo: { ...mockUser, ...updateUserDto } });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...updateUserDto,
      });
    });

    it('유저가 없을 경우 에러를 던집니다.', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        usersService.updateMyInfo(
          'nonexistent@example.com',
          {} as UpdateUserDto,
        ),
      ).rejects.toThrow('User not found');
    });
  });

  describe('updateLanguage', () => {
    it('유저 언어 설정을 업데이트합니다.', async () => {
      const updateLanguageDto: UpdateLanguageDto = { language: 'ENGLISH' };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest
        .spyOn(usersLanguageRepository, 'update')
        .mockResolvedValue(undefined);
      jest.spyOn(usersLanguageRepository, 'findOneBy').mockResolvedValue({
        ...mockLanguage,
        language: 'ENGLISH',
      });

      const result = await usersService.updateLanguage(
        'test@example.com',
        updateLanguageDto,
      );

      expect(result).toEqual({
        myInfo: { ...mockLanguage, language: 'ENGLISH' },
      });
      expect(usersLanguageRepository.update).toHaveBeenCalledWith(
        { user_id: mockUser.id },
        { language: 'ENGLISH' },
      );
    });

    it('유저가 없을 경우 에러를 던집니다.', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        usersService.updateLanguage('nonexistent@example.com', {
          language: 'ENGLISH',
        }),
      ).rejects.toThrow('User not found');
    });
  });
});
