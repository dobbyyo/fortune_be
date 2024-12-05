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
  firstSolarTerms,
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
      let endTime = endHour * 60 + endMinute;

      // 날짜 경계 처리
      if (endTime < startTime) {
        endTime += 1440; // 다음날로 이동
      }

      // targetTime이 경계를 넘어갔을 경우
      let adjustedTargetTime = targetTime;
      if (targetTime < startTime && endTime > 1440) {
        adjustedTargetTime += 1440; // targetTime을 다음날로 이동
      }

      if (adjustedTargetTime >= startTime && adjustedTargetTime < endTime) {
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

    console.log('yearStem', yearStem, 'birthDate', birthDate);
    console.log('birth', birth);
    console.log('lunarDate', lunarDate);

    let lunarMonth = lunarDate.lunarMonth;
    const lunarDay = lunarDate.lunarDay;

    // 음력 날짜와 절기 기준으로 월 계산
    for (const term of firstSolarTerms) {
      if (lunarMonth === term.month && lunarDate.lunarDay >= term.startDay) {
        break; // 현재 월 유지
      } else if (lunarMonth === term.month && lunarDay < term.startDay) {
        lunarMonth -= 1; // 이전 월로 이동
        if (lunarMonth < 1) {
          lunarMonth = 12; // 음력 1월 이전은 12월로
        }
        break;
      }
    }

    const monthPillar = monthPillarsTable[yearStem][lunarMonth - 1];

    const monthStem = monthPillar.charAt(0);
    const monthBranch = monthPillar.charAt(1);
    return { monthStem, monthBranch };
  }

  private calculateTotalDays(baseDate: Date, targetDate: Date): number {
    // 1. 생일년도 - 1 - 기준년도 + 1
    const step1 = targetDate.getFullYear() - 1 - baseDate.getFullYear() + 1;

    // 2. 1번 값 * 365
    const step2 = step1 * 365;

    // 3. 2번 값에서 윤년 개수 추가 (생일년도 - 1까지)

    const step3 = Math.floor(step1 / 4);

    // 4. 출생년도에 대한 누적일 계산 (1월부터 출생월까지)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const isLeapYear = (year: number) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    if (isLeapYear(targetDate.getFullYear())) {
      daysInMonth[1] = 29; // 윤년일 경우 2월 일수 수정
    }

    const step4 =
      daysInMonth
        .slice(0, targetDate.getMonth())
        .reduce((sum, days) => sum + days, 0) + targetDate.getDate();

    // 5. 최종 계산: 2번값 + 3번값 - 42 + 4번값
    const totalDays = step2 + step3 - 42 + step4;

    return totalDays;
  }

  // 일간 기둥 계산 함수
  private calculateDayPillar(
    birthYear: number,
    birthMonth: number,
    birthDay: number,
  ) {
    const baseDate = new Date(1936, 1, 12);
    const targetDate = new Date(birthYear, birthMonth - 1, birthDay);
    const totalDays = this.calculateTotalDays(baseDate, targetDate);

    // 천간과 지지 계산
    const ganIndex = totalDays % 10; // 천간은 10주기로 반복
    const jiIndex = totalDays % 12; // 지지는 12주기로 반복

    const dayGan = heavenlyStems[ganIndex];
    const dayJi = earthlyBranches[jiIndex];

    return { dayGan, dayJi };
  }

  // 시간 기둥 계산 함수
  private calculateHourPillar(dayGan: string, hour: number, minute: number) {
    console.log('dayGan', dayGan, 'hour', hour, 'minute', minute);

    // 1. 천간 시작값 찾기
    const timeGanStart = timeGanBase[dayGan]; // 일간 기준으로 시작 천간 결정
    console.log('timeGanStart', timeGanStart);

    const timeGanIndex = heavenlyStems.indexOf(timeGanStart); // 시작 천간의 인덱스
    console.log('timeGanIndex', timeGanIndex);

    // 2. 지지 찾기
    const timeBranch = this.getTimeBranch(hour, minute); // 시각에 해당하는 지지 찾기
    console.log('timeBranch', timeBranch);

    // 3. 천간 계산 (시작 천간부터 지지 인덱스를 더해서 순환)
    const branchIndex = timeBranches.findIndex(
      (branch) => branch.branch === timeBranch,
    );
    const timeGan = heavenlyStems[(timeGanIndex + branchIndex) % 10]; // 천간 순환
    console.log('timeGan', timeGan);

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

  // 사주 계산 함수
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
