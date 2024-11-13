import { Injectable } from '@nestjs/common';
import { SandbarEntity } from './entities/sandbar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenaiService } from '../openai/openai.service';

import { UserResponse } from '../auth/types/user.type';
import { FortuneCalculationService } from './fortunes-calculation.service';
import { EarthlyBranchesEntity } from './entities/earthly_baranches.entity';
import { HeavenlyStemsEntity } from './entities/heavenly_stems.entity';

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
  ) {}

  private async fetchDatabaseEarthlyInfo(
    elements: Record<string, '목' | '화' | '토' | '금' | '수'>,
  ): Promise<Record<string, HeavenlyStemsEntity>> {
    const elementData = {};
    for (const [key, element] of Object.entries(elements)) {
      const data = await this.earthlyBranchesRepository.findOne({
        where: { element },
      });
      elementData[key] = data;
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
      });
      elementData[key] = data;
    }
    return elementData;
  }

  async getSandbar(
    userData: UserResponse,
    birthDate: string,
    birthHour: number,
    birthMinute: number,
  ) {
    const fortunesData = this.fortuneCalculationService.calculateFourPillars(
      birthDate,
      birthHour,
      birthMinute,
    );

    // 각 요소별로 DB 정보를 불러와서 elements에 추가
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
          databaseInfo: {
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
          databaseInfo: {
            year: earthlyElementData.year,
            month: earthlyElementData.month,
            day: earthlyElementData.day,
            hour: earthlyElementData.hour,
          },
        },
      },
    };

    return { fortunesData: response };
  }
}
