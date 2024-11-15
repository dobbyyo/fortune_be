import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { OpenaiService } from '../openai/openai.service';

import { UserResponse } from '../auth/types/user.type';
import { FortuneCalculationService } from './fortunes-calculation.service';
import { EarthlyBranchesEntity } from './entities/earthly_baranches.entity';
import { HeavenlyStemsEntity } from './entities/heavenly_stems.entity';
import { RedisService } from '../redis/redis.service';
import { GetTodayFortunesType } from './types/get-today-fortunes.type';
import { ZodiacFortuneEntity } from './entities/zodiac_fortune.entity';
import { todayYear } from '@/src/utils/today.util';
import { StarSignFortuneEntity } from './entities/star_sign_fortune.entity';
import { SaveSandbarDto } from './dto/save-today-fortunes.dto';
import { SavedFortunesEntity } from './entities/saved_fortunes.entity';
import { SavedStarEntity } from './entities/saved_star.entity';
import { SavedZodiacEntity } from './entities/saved_zodiac.entity';
import { SavedSandbarsEntity } from './entities/saved_sandbars.entity';
import { toSnakeCaseKeys } from '@/src/utils/lodash-change.util';
import { DeleteSandbarDto } from './dto/delete-sandbar.dto';

@Injectable()
export class FortunesService {
  constructor(
    @InjectRepository(EarthlyBranchesEntity)
    private readonly earthlyBranchesRepository: Repository<EarthlyBranchesEntity>,
    @InjectRepository(HeavenlyStemsEntity)
    private readonly heavenlyStemsRepository: Repository<HeavenlyStemsEntity>,
    @InjectRepository(ZodiacFortuneEntity)
    private readonly zodiacFortuneRepository: Repository<ZodiacFortuneEntity>,
    @InjectRepository(StarSignFortuneEntity)
    private readonly starSignFortuneRepository: Repository<StarSignFortuneEntity>,

    @InjectRepository(SavedFortunesEntity)
    private readonly fortunesRepository: Repository<SavedFortunesEntity>,
    @InjectRepository(SavedStarEntity)
    private readonly starRepository: Repository<SavedStarEntity>,
    @InjectRepository(SavedZodiacEntity)
    private readonly zodiacRepository: Repository<SavedZodiacEntity>,
    @InjectRepository(SavedSandbarsEntity)
    private readonly sandbarRepository: Repository<SavedSandbarsEntity>,

    private readonly openaiService: OpenaiService,
    private readonly fortuneCalculationService: FortuneCalculationService,
    private readonly redisService: RedisService,
  ) {}

  private async fetchDatabaseEarthlyInfo(
    elements: Record<string, '목' | '화' | '토' | '금' | '수'>,
  ): Promise<Record<string, HeavenlyStemsEntity>> {
    const elementData = {};
    for (const [key, element] of Object.entries(elements)) {
      const data = await this.earthlyBranchesRepository.findOne({
        where: { element },
        select: ['image_url'],
      });
      elementData[key] = data.image_url;
    }
    return elementData;
  }

  private async fetchDatabaseHeavenlyInfo(
    elements: Record<string, '목' | '화' | '토' | '금' | '수'>,
  ): Promise<Record<string, EarthlyBranchesEntity>> {
    const elementData = {};
    for (const [key, element] of Object.entries(elements)) {
      const data = await this.heavenlyStemsRepository.findOne({
        where: { element },
        select: ['image_url'],
      });
      elementData[key] = data.image_url;
    }
    return elementData;
  }

  async getTodayForunes(
    userData: UserResponse,
    birthDate: string,
    birthHour: number,
    birthMinute: number,
  ) {
    const redisKey = `fortunesData:${userData.userId}`;

    // Redis에서 캐시된 데이터가 있는지 확인
    const cachedData = await this.redisService.get(redisKey);
    if (cachedData) {
      return { fortunesData: cachedData };
    }

    const fortunesData = this.fortuneCalculationService.calculateFourPillars(
      birthDate,
      birthHour,
      birthMinute,
    );

    // imgurl db에서 호출
    const heavenlyElementData = await this.fetchDatabaseHeavenlyInfo(
      fortunesData.heavenly.elements,
    );
    const earthlyElementData = await this.fetchDatabaseEarthlyInfo(
      fortunesData.earthly.elements,
    );

    const response = {
      ...fortunesData,
      heavenly: {
        ...fortunesData.heavenly,
        elements: {
          baseElements: fortunesData.heavenly.elements,
          img: {
            year: heavenlyElementData.year,
            month: heavenlyElementData.month,
            day: heavenlyElementData.day,
            hour: heavenlyElementData.hour,
          },
        },
      },
      earthly: {
        ...fortunesData.earthly,
        elements: {
          baseElements: fortunesData.earthly.elements,
          img: {
            year: earthlyElementData.year,
            month: earthlyElementData.month,
            day: earthlyElementData.day,
            hour: earthlyElementData.hour,
          },
        },
      },
    };

    await this.redisService.set(redisKey, { fortunesData: response }, 3600);

    return { fortunesData: response };
  }

  async getTodayForunesExplanation(
    userData: UserResponse,
    birthDate: string,
    birthHour: number,
    birthMinute: number,
  ) {
    const redisKey = `fortunesData:${userData.userId}`;

    let fortunesData = await this.redisService.get(redisKey);

    // 캐시가 없을 경우 다시 계산하고 저장
    if (!fortunesData) {
      fortunesData = await this.getTodayForunes(
        userData,
        birthDate,
        birthHour,
        birthMinute,
      );
      await this.redisService.set(redisKey, fortunesData, 3600); // TTL: 1시간
    }

    const explanationData = await this.openaiService.getTodayFortunes(
      fortunesData as GetTodayFortunesType,
    );
    return { explanationData };
  }

  async getZodiacFortunes(birthDate: string) {
    const year = birthDate.split('-')[0];

    const zodiacFortune = await this.zodiacFortuneRepository.findOne({
      where: [
        {
          rest: Number(year) % 12, // 띠의 시작 연도를 12로 나눈 나머지를 통해 찾기
          cycle: 12, // 띠가 12년 주기로 반복되므로 주기를 지정
        },
      ],
    });

    if (!zodiacFortune) {
      throw new Error('해당 연도에 맞는 띠 운세가 없습니다.');
    }
    const today = todayYear();

    const aiRes = await this.openaiService.getZodiacFortunes(
      zodiacFortune,
      today,
    );

    const response = {
      ...zodiacFortune,
      ...aiRes,
    };

    return { zodiacFortune: response };
  }

  async getConstellationFortunes(birthDate: string) {
    const monthDay = birthDate.slice(5).replace('-', '.');

    const constellation = await this.starSignFortuneRepository
      .createQueryBuilder('star_sign_fortune')
      .where(
        new Brackets((qb) => {
          qb.where('star_sign_fortune.start_date <= :monthDay', {
            monthDay,
          }).andWhere('star_sign_fortune.end_date >= :monthDay', { monthDay });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where('star_sign_fortune.start_date > star_sign_fortune.end_date') // 달을 넘기는 경우 (예: 12.25 - 01.19)
            .andWhere(
              new Brackets((qb) => {
                qb.where('star_sign_fortune.start_date <= :monthDay', {
                  monthDay,
                }).orWhere('star_sign_fortune.end_date >= :monthDay', {
                  monthDay,
                });
              }),
            );
        }),
      )
      .getOne();

    const aiRes =
      await this.openaiService.getConstellationFortunes(constellation);

    const response = {
      ...constellation,
      ...aiRes,
    };

    return { constellation: response };
  }

  async saveFortunes(saveSandbarDto: SaveSandbarDto) {
    const todaysFortuneData = toSnakeCaseKeys(saveSandbarDto.todaysFortune);
    const zodiacFortuneData = toSnakeCaseKeys(saveSandbarDto.zodiacFortune);
    const starSignFortuneData = toSnakeCaseKeys(saveSandbarDto.starSignFortune);

    const savedTodaysFortune =
      await this.fortunesRepository.save(todaysFortuneData);
    const savedZodiac = await this.zodiacRepository.save(zodiacFortuneData);
    const savedStarSign = await this.starRepository.save(starSignFortuneData);

    const savedSandbar = this.sandbarRepository.create({
      user_id: saveSandbarDto.userId,
      title: saveSandbarDto.title,
      todays_fortune_id: savedTodaysFortune.id,
      zodiac_fortune_id: savedZodiac.id,
      star_sign_fortune_id: savedStarSign.id,
    });

    const response = await this.sandbarRepository.save(savedSandbar);
    return { savedSandbar: response };
  }

  async deleteSandbar(deleteSandbarDto: DeleteSandbarDto) {
    const { sandbarId, userId } = deleteSandbarDto;
    console.log(sandbarId, userId);
    const savedSandbar = await this.sandbarRepository.findOne({
      where: { id: sandbarId, user_id: userId },
    });
    console.log(savedSandbar);
    if (!savedSandbar) {
      throw new NotFoundException('해당 사주 정보가 없습니다.');
    }

    if (Number(savedSandbar.user_id) !== Number(userId)) {
      throw new ForbiddenException('사용자 정보가 일치하지 않습니다.');
    }

    // 관련된 운세 엔티티 삭제
    await this.fortunesRepository.delete(savedSandbar.todays_fortune_id);
    await this.zodiacRepository.delete(savedSandbar.zodiac_fortune_id);
    await this.starRepository.delete(savedSandbar.star_sign_fortune_id);

    // 최종적으로 SavedSandbarsEntity 삭제
    await this.sandbarRepository.delete({
      id: sandbarId,
      user_id: userId,
    });

    return 'Successfully';
  }
}
