import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from './entities/users.entity';
import { JwtAuthGuard } from '@/src/guards/jwt-auth.guard';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUser: UsersEntity = {
    id: 1,
    email: 'test@example.com',
  } as UsersEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(mockUser),
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

  it('should return user info for authenticated user', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

    const result = await usersController.getMyInfo({
      user: { email: 'test@example.com' },
    } as any);

    expect(result).toEqual(mockUser);
    expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});
