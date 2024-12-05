export interface BaseElements {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export interface HeavenlyEarthlyData {
  year: string;
  month: string;
  day: string;
  hour: string;
  elements: {
    img: BaseElements;
    baseElements: BaseElements;
  };
}
export interface FortunesData {
  heavenly: HeavenlyEarthlyData;
  earthly: HeavenlyEarthlyData;
  heavenlyStemTenGod: BaseElements;
  earthlyBranchTenGod: BaseElements;
  tenStemTwelveStates: BaseElements;
  twelveGod: BaseElements;
}

export interface TodayFortuneType {
  fortunesData: FortunesData;
}
