import { Injectable, NotFoundException } from '@nestjs/common';
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
import { SavedUserTarotCardsEntity } from '../tarots/entities/saved_user_tarot_cards.entity';
import { SavedFortunesEntity } from '../fortunes/entities/saved_fortunes.entity';
import { SavedZodiacEntity } from '../fortunes/entities/saved_zodiac.entity';
import { SavedStarEntity } from '../fortunes/entities/saved_star.entity';
import { SavedSandbarsEntity } from '../fortunes/entities/saved_sandbars.entity';
import { SavedDreamInterpretationEntity } from '../dreams/entities/saved_dream_interpretation.entity';
import { SavedNamingEntity } from '../namings/entities/saved_naming.entity';
import { TarotCardsEntity } from '../tarots/entities/tarot_cards.entity';
import { StarSignFortuneEntity } from '../fortunes/entities/star_sign_fortune.entity';
import { ZodiacFortuneEntity } from '../fortunes/entities/zodiac_fortune.entity';
import { NamingEntity } from '../namings/entities/naming.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(UsersLanguageEntity)
    private readonly usersLanguageRepository: Repository<UsersLanguageEntity>,
    @InjectRepository(SavedUserTarotCardsEntity)
    private readonly savedTarotMainTitles: Repository<SavedUserTarotCardsEntity>,
    @InjectRepository(SavedFortunesEntity)
    private readonly savedFortunes: Repository<SavedFortunesEntity>,
    @InjectRepository(SavedZodiacEntity)
    private readonly savedZodiacs: Repository<SavedZodiacEntity>,
    @InjectRepository(SavedStarEntity)
    private readonly savedStars: Repository<SavedStarEntity>,
    @InjectRepository(SavedSandbarsEntity)
    private readonly savedSandbars: Repository<SavedSandbarsEntity>,
    @InjectRepository(SavedDreamInterpretationEntity)
    private readonly savedDreamInterpretations: Repository<SavedDreamInterpretationEntity>,
    @InjectRepository(SavedNamingEntity)
    private readonly savedNamings: Repository<SavedNamingEntity>,
    @InjectRepository(TarotCardsEntity)
    private readonly tarotCardsRepository: Repository<TarotCardsEntity>,
    @InjectRepository(StarSignFortuneEntity)
    private readonly starSignFortuneEntity: Repository<StarSignFortuneEntity>,
    @InjectRepository(ZodiacFortuneEntity)
    private readonly zodiacFortuneEntity: Repository<ZodiacFortuneEntity>,
    @InjectRepository(NamingEntity)
    private readonly namingEntity: Repository<NamingEntity>,

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

  // 나의 북마크 가져오기
  async getMyBookmarks(myEmail: string) {
    const user = await this.userRepository.findOneBy({
      email: myEmail,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const saveData = await this.userRepository.findOne({
      where: { id: user.id },
      relations: [
        'savedTarotMainTitles',
        'savedSandbars',
        'savedDreamInterpretations',
        'savedNamings',
      ],
    });

    const {
      savedTarotMainTitles,
      savedSandbars,
      savedDreamInterpretations,
      savedNamings,
    } = saveData;

    return {
      myBookmarks: {
        savedTarot: savedTarotMainTitles,
        savedFortune: savedSandbars,
        hasSavedDream: savedDreamInterpretations.length > 0, // true if there is data
        hasSavedNaming: savedNamings.length > 0, // true if there is data
      },
    };
  }

  // 타로카드 상세 북마크 가져오기
  async getMyBookmarksTarotCardDetails(myEmail: string, tarotCardId: number) {
    const user = await this.userRepository.findOneBy({
      email: myEmail,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const savedTarotCards = await this.savedTarotMainTitles.find({
      where: { user_id: user.id, mainTitle: { id: tarotCardId } }, // Use relation object here
    });

    // 카드 이미지 및 추가 정보 조회
    const savedTarotCardsResults = await Promise.all(
      Object.keys(savedTarotCards).map(async (key) => {
        const item = savedTarotCards[key];
        if (key === 'card') {
          return { ...item }; // 카드 전체 정보 유지
        }
        const card = await this.tarotCardsRepository.findOneBy({
          id: item.card_id,
        });
        if (!card) {
          throw new NotFoundException(
            `카드 ID ${item.card_id}를 찾을 수 없습니다.`,
          );
        }

        return {
          id: item.id,
          subTitle: item.sub_title,
          userId: item.user_id,
          cardId: item.card_id,
          isUpright: item.is_upright,
          cardInterpretation: item.card_interpretation,
          cardName: card.name,
          imgUrl: card.image_url, // 이미지 추가
        };
      }),
    );

    return { savedTarotCardsResults };
  }

  async getMyBookmarksFortuneDetails(
    myEmail: string,
    fortuneId: number,
    zodiacId: number,
    startId: number,
  ) {
    const user = await this.userRepository.findOneBy({
      email: myEmail,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const saveMainFortune = await this.savedSandbars.findOne({
      where: { user: { id: user.id }, todays_fortune: { id: fortuneId } }, // Use relation object here
    });

    if (!saveMainFortune) {
      throw new Error('정보가 없습니다');
    }

    const savedFortuneCards = await this.savedFortunes.find({
      where: { id: fortuneId }, // Use relation object here
    });

    const savedZodiacs = await this.savedZodiacs.find({
      where: { id: zodiacId }, // Use relation object here
    });

    const savedZodiacsImg = await this.zodiacFortuneEntity.findOne({
      where: { name: savedZodiacs[0].zodiac_title },
    });

    const savedStars = await this.savedStars.find({
      where: { id: startId }, // Use relation object here
    });

    const savedStarImg = await this.starSignFortuneEntity.findOne({
      where: { name: savedStars[0].star_sign },
    });

    const res = {
      savedFortuneCards: savedFortuneCards[0],
      savedZodiacs: {
        ...savedZodiacs[0],
        image_url: savedZodiacsImg.image_url,
      },
      savedStars: {
        ...savedStars[0],
        start_date: savedStarImg.start_date,
        end_date: savedStarImg.end_date,
        image_url: savedStarImg.image_url,
      },
    };
    return { savedFortune: res };
  }

  // 꿈해몽 상세 북마크 가져오기
  async getMyBookmarksDreamDetails(myEmail: string) {
    const user = await this.userRepository.findOneBy({
      email: myEmail,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const savedDream = await this.savedDreamInterpretations.find({
      where: { user: { id: user.id } },
    });

    return { savedDream };
  }

  // 작명 상세 북마크 가져오기
  async getMyBookmarksNamingDetails(myEmail: string) {
    const user = await this.userRepository.findOneBy({
      email: myEmail,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const savedNaming = await this.savedNamings.find({
      where: { user: { id: user.id } },
      relations: ['naming'],
    });

    return { savedNaming };
  }

  // 탈퇴하기
  async deleteUser(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete({ id: userId });

    return 'Successful';
  }
}
