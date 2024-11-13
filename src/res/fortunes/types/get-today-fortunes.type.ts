export interface GetTodayFortunesType {
  fortunesData: {
    heavenly: {
      // 천간
      year: string;
      month: string;
      day: string;
      hour: string;
      elements: {
        baseElements: {
          year: string;
          month: string;
          day: string;
          hour: string;
        };
        img: {
          year: string;
          month: string;
          day: string;
          hour: string;
        };
      };
    };
    // 지지
    earthly: {
      year: string;
      month: string;
      day: string;
      hour: string;
      elements: {
        baseElements: {
          year: string;
          month: string;
          day: string;
          hour: string;
        };
        img: {
          year: string;
          month: string;
          day: string;
          hour: string;
        };
      };
    };
    // 천간에 대한 십성
    heavenlyStemTenGod: {
      year: string;
      month: string;
      day: string;
      hour: string;
    };

    // 지지에 대한 십성
    earthlyBranchTenGod: {
      year: string;
      month: string;
      day: string;
      hour: string;
    };

    // 12운성
    tenStemTwelveStates: {
      year: string;
      month: string;
      day: string;
      hour: string;
    };

    // 12신살
    twelveGod: {
      year: string;
      month: string;
      day: string;
      hour: string;
    };
  };
}
