import { Injectable } from '@nestjs/common';
import {
  heavenlyStems,
  earthlyBranches,
  baseYear,
  monthPillarsTable,
  timeGanBase,
  timeBranches,
  tenGodsHeavenlyMatchingTable,
  tenGodsEarthlyBranchTable,
  tenStemTwelveStatesTable,
  elementForBranch,
  twelveGodsTable,
  elementsTable,
} from '@/src/define/fortune.type';
import * as holidayKR from 'holiday-kr';
import { InjectRepository } from '@nestjs/typeorm';
import { SpringDatesEntity } from './entities/spring.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FortuneCalculationService {
  constructor(
    @InjectRepository(SpringDatesEntity)
    private readonly springDatesRepository: Repository<SpringDatesEntity>,
  ) {}

  // 춘추 날짜를 가져오는 함수
  private async getIpchunDate(year: number): Promise<Date | null> {
    const springDate = await this.springDatesRepository.findOne({
      where: { year },
    });
    return springDate ? springDate.date : null;
  }

  // 음력 날짜를 양력 날짜로 변환
  private convertToLunar(year: number, month: number, day: number) {
    const lunarDate = holidayKR.getLunar(year, month, day);
    return {
      lunarYear: lunarDate.year,
      lunarMonth: lunarDate.month,
      lunarDay: lunarDate.day,
      isLeapMonth: lunarDate.leapMonth,
    };
  }

  // 시간에 따른 지지 계산 함수
  private getTimeBranch(hour: number, minute: number): string | null {
    const targetTime = hour * 60 + minute;
    for (const time of timeBranches) {
      const [startHour, startMinute] = time.start.split(':').map(Number);
      const [endHour, endMinute] = time.end.split(':').map(Number);
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      if (targetTime >= startTime && targetTime < endTime) {
        return time.branch;
      }
    }
    return null;
  }

  // 연간 기둥 계산 함수
  private async calculateYearPillar(year: number, birthDate: string) {
    const ipchunDate = await this.getIpchunDate(year);
    const birth = new Date(birthDate);
    const isBeforeIpchun = birth < ipchunDate;
    const effectiveYear = isBeforeIpchun ? year - 1 : year;
    const index = (effectiveYear - baseYear) % 60;
    const yearStem = heavenlyStems[index % 10];
    const yearBranch = earthlyBranches[index % 12];
    return { yearStem, yearBranch };
  }

  // 월간 기둥 계산 함수
  private calculateMonthPillar(yearStem: string, birthDate: string) {
    const birth = new Date(birthDate);
    const lunarDate = this.convertToLunar(
      birth.getFullYear(),
      birth.getMonth() + 1,
      birth.getDate(),
    );
    const birthMonth = lunarDate.lunarMonth;
    const monthPillar = monthPillarsTable[yearStem][birthMonth - 1];
    const monthStem = monthPillar.charAt(0);
    const monthBranch = monthPillar.charAt(1);
    return { monthStem, monthBranch };
  }

  // 일간 기둥 계산 함수
  private calculateDayPillar(
    birthYear: number,
    birthMonth: number,
    birthDay: number,
  ) {
    const baseDate = new Date(1936, 1, 12);
    const targetDate = new Date(birthYear, birthMonth - 1, birthDay);
    const days = Math.floor(
      (targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const ganIndex = days % 10;
    const jiIndex = days % 12;
    const dayGan = heavenlyStems[ganIndex];
    const dayJi = earthlyBranches[jiIndex];
    return { dayGan, dayJi };
  }

  // 시간 기둥 계산 함수
  private calculateHourPillar(dayGan: string, hour: number, minute: number) {
    const timeGanStart = timeGanBase[dayGan];
    const timeGanIndex =
      heavenlyStems.indexOf(timeGanStart) + (Math.floor(hour / 2) % 10);
    const timeGan = heavenlyStems[timeGanIndex % 10];
    const timeBranch = this.getTimeBranch(hour, minute);
    return { timeGan, timeBranch };
  }

  private getTenGodFromHeavenlyStem(
    dayStem: string,
    otherStem: string,
  ): string | undefined {
    return tenGodsHeavenlyMatchingTable[dayStem]
      ? tenGodsHeavenlyMatchingTable[dayStem][otherStem]
      : undefined;
  }

  // 지지 기반 십성 계산 함수
  private getTenGodFromEarthlyBranch(
    branch: string,
    dayStem: string,
  ): string | undefined {
    return tenGodsEarthlyBranchTable[branch]
      ? tenGodsEarthlyBranchTable[branch][dayStem]
      : undefined;
  }

  // 십성을 구하는 함수
  private getTenGod(dayStem: string, otherStem: string) {
    const num = earthlyBranches.indexOf(otherStem);

    return tenStemTwelveStatesTable[dayStem]
      ? tenStemTwelveStatesTable[dayStem][num]
      : undefined;
  }

  // 특정 지지에 대한 12신살을 구하는 함수
  private getTwelveGod(branch: string) {
    const element = elementForBranch[branch];
    const index = earthlyBranches.indexOf(branch);
    return twelveGodsTable[element][index];
  }

  async calculateFourPillars(
    birthDate: string,
    birthHour: number,
    birthMinute: number,
  ) {
    const birthYear = new Date(birthDate).getFullYear();

    // 기본 사주 정보 계산
    const yearPillar = await this.calculateYearPillar(birthYear, birthDate);

    const monthPillar = this.calculateMonthPillar(
      yearPillar.yearStem,
      birthDate,
    );

    const dayPillar = this.calculateDayPillar(
      birthYear,
      new Date(birthDate).getMonth() + 1,
      new Date(birthDate).getDate(),
    );

    const hourPillar = this.calculateHourPillar(
      dayPillar.dayGan,
      birthHour,
      birthMinute,
    );

    // 십성 및 12운성 관련 추가 계산
    const heavenlyStemTenGod = {
      year: this.getTenGodFromHeavenlyStem(
        dayPillar.dayGan,
        yearPillar.yearStem,
      ),
      month: this.getTenGodFromHeavenlyStem(
        dayPillar.dayGan,
        monthPillar.monthStem,
      ),
      day: this.getTenGodFromHeavenlyStem(dayPillar.dayGan, dayPillar.dayGan),
      hour: this.getTenGodFromHeavenlyStem(
        dayPillar.dayGan,
        hourPillar.timeGan,
      ),
    };

    const earthlyBranchTenGod = {
      year: this.getTenGodFromEarthlyBranch(
        yearPillar.yearBranch,
        dayPillar.dayGan,
      ),
      month: this.getTenGodFromEarthlyBranch(
        monthPillar.monthBranch,
        dayPillar.dayGan,
      ),
      day: this.getTenGodFromEarthlyBranch(dayPillar.dayJi, dayPillar.dayGan),
      hour: this.getTenGodFromEarthlyBranch(
        hourPillar.timeBranch,
        dayPillar.dayGan,
      ),
    };

    const tenStemTwelveStates = {
      year: this.getTenGod(dayPillar.dayGan, yearPillar.yearBranch),
      month: this.getTenGod(dayPillar.dayGan, monthPillar.monthBranch),
      day: this.getTenGod(dayPillar.dayGan, dayPillar.dayJi),
      hour: this.getTenGod(dayPillar.dayGan, hourPillar.timeBranch),
    };

    const twelveGod = {
      year: this.getTwelveGod(yearPillar.yearBranch),
      month: this.getTwelveGod(monthPillar.monthBranch),
      day: this.getTwelveGod(dayPillar.dayJi),
      hour: this.getTwelveGod(hourPillar.timeBranch),
    };

    // 최종 결과 구조화
    return {
      heavenly: {
        year: yearPillar.yearStem,
        month: monthPillar.monthStem,
        day: dayPillar.dayGan,
        hour: hourPillar.timeGan,
        elements: {
          year: elementsTable[yearPillar.yearStem],
          month: elementsTable[monthPillar.monthStem],
          day: elementsTable[dayPillar.dayGan],
          hour: elementsTable[hourPillar.timeGan],
        },
      },
      earthly: {
        year: yearPillar.yearBranch,
        month: monthPillar.monthBranch,
        day: dayPillar.dayJi,
        hour: hourPillar.timeBranch,
        elements: {
          year: elementsTable[yearPillar.yearBranch],
          month: elementsTable[monthPillar.monthBranch],
          day: elementsTable[dayPillar.dayJi],
          hour: elementsTable[hourPillar.timeBranch],
        },
      },
      heavenlyStemTenGod,
      earthlyBranchTenGod,
      tenStemTwelveStates,
      twelveGod,
    };
  }
}
