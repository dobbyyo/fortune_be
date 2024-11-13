import { Injectable } from '@nestjs/common';
import { SandbarEntity } from './entities/sandbar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenaiService } from '../openai/openai.service';

import { UserResponse } from '../auth/types/user.type';
import { FortuneCalculationService } from './fortunes-calculation.service';
import { EarthlyBranchesEntity } from './entities/earthly_baranches.entity';
import { HeavenlyStemsEntity } from './entities/heavenly_stems.entity';
import { RedisService } from '../redis/redis.service';
import { GetTodayFortunesType } from './types/get-today-fortunes.type';

@Injectable()
export class FortunesService {
  constructor(
    @InjectRepository(SandbarEntity)
    private readonly sandbarRepository: Repository<SandbarEntity>,
    @InjectRepository(EarthlyBranchesEntity)
    private readonly earthlyBranchesRepository: Repository<EarthlyBranchesEntity>,
    @InjectRepository(HeavenlyStemsEntity)
    private readonly heavenlyStemsRepository: Repository<HeavenlyStemsEntity>,
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
      userData,
      fortunesData as GetTodayFortunesType,
    );
    return { explanationData };
  }
}
