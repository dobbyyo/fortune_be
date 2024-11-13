import { EarthlyBranchesEntity } from '../entities/earthly_baranches.entity';
import { HeavenlyStemsEntity } from '../entities/heavenly_stems.entity';

export interface ElementsWithAdditionalData {
  baseElements: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  data: {
    year: HeavenlyStemsEntity | EarthlyBranchesEntity;
    month: HeavenlyStemsEntity | EarthlyBranchesEntity;
    day: HeavenlyStemsEntity | EarthlyBranchesEntity;
    hour: HeavenlyStemsEntity | EarthlyBranchesEntity;
  };
}
