import {
  CurrentStatus,
  LightingType,
  PredictiveStatus,
} from "../../models/index";

export interface ISortAndPaginate {
  limit: number;
  offset: number;
  searchText?: string;
}

export interface ILightingAssetFilter {
  floor?: number;
  section?: string;
  area?: string;
  lightingType?: LightingType;
  currentStatus?: CurrentStatus;
  predictedStatus?: PredictiveStatus;
}

export interface ITimeSeriesDataThresholds {
  [key: string]: {
    thresholdValue: number;
    comparison: "LESS" | "MORE" | "EQUAL";
  };
}
