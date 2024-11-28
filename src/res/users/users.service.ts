import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersEntity } from '@res/users/entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersLanguageEntity } from './entities/users_language.entity';
import { UsersNotificationEntity } from './entities/users_notification.entity';
import { UsersPasswordEntity } from './entities/users_password.entity';
import { UsersProfileEntity } from './entities/users_profile.entity';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(UsersLanguageEntity)
    private readonly usersLanguageRepository: Repository<UsersLanguageEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // 나의 정보 가져오기
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['language', 'notification', 'profile', 'password'],
    });
    return { myInfo: user };
  }

  // 회원가입
  async createUser(userDto: CreateUserDto): Promise<UsersEntity> {
    return await this.dataSource.transaction(async (manager) => {
      // UsersEntity 저장
      const newUser = manager.create(UsersEntity, userDto);
      const savedUser = await manager.save(newUser);

      // UsersLanguageEntity 기본값 생성
      const newLanguage = manager.create(UsersLanguageEntity, {
        user_id: savedUser.id,
        user: savedUser,
      });

      // UsersNotificationEntity 기본값 생성
      const newNotification = manager.create(UsersNotificationEntity, {
        user_id: savedUser.id,
        user: savedUser,
      });

      // UsersProfileEntity 기본값 생성
      const newProfile = manager.create(UsersProfileEntity, {
        user_id: savedUser.id,
        profile_url: userDto.avatar,
        user: savedUser,
      });

      // UsersPasswordEntity 기본값 생성
      const newPassword = manager.create(UsersPasswordEntity, {
        user_id: savedUser.id,
        user: savedUser,
      });

      // 각 엔티티 저장
      await manager.save(newLanguage);
      await manager.save(newNotification);
      await manager.save(newProfile);
      await manager.save(newPassword);

      return savedUser;
    });
  }

  // 나의 정보 수정하기
  async updateMyInfo(myEmail: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      email: myEmail,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return { myInfo: updatedUser };
  }

  // 언어 설정 변경하기
  async updateLanguage(myEmail: string, updateLanguageDto: UpdateLanguageDto) {
    const user = await this.userRepository.findOneBy({
      email: myEmail,
    });
    if (!user) {
      throw new Error('User not found');
    }

    await this.usersLanguageRepository.update(
      { user_id: user.id },
      { language: updateLanguageDto.language },
    );

    const updatedLanguage = await this.usersLanguageRepository.findOneBy({
      user_id: user.id,
    });

    return { myInfo: updatedLanguage };
  }
}
