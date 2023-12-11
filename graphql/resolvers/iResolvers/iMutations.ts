import {
  CurrentStatus,
  LightingType,
  PredictiveStatus,
  Location,
  WorkOrderStatus,
} from '../../models/index';
import { WorkOrderType } from '../../models/WorkOrder';

export interface IAddLightingAssetInput {
  uid: string;
  currentStatus: CurrentStatus;
  predictiveStatus: {
    status: PredictiveStatus;
    predictedTime: Date;
  };
  type: LightingType;
  cilLevel: 1 | 2;
  location: Location;
}

export interface IUpdateLightingAssetInput {
  uid: string;
  currentStatus?: CurrentStatus;
  predictiveStatus?: {
    status: PredictiveStatus;
    predictedTime: Date;
  };
  type?: LightingType;
  location?: Location;
  cilLevel?: 1 | 2;
}

export interface ILightingAssetMeasurementInput {
  assetId: string;
  timestamp: string;
  power?: {
    WATT?: { value: number };
    // this makes sense for it to be a different type than in LightingAssetTimeSeriesData.ts
    // since this is an input, and not output type (healthStatus is excluded in here because those are read only)
  };
  illuminance?: {
    maintainedAverage?: { value: number };
    uniformityRatio?: { value: number };
  };
  glare?: {
    UGR?: { value: number };
  };
  colorRendering?: {
    CRI?: { value: number };
  };
  colorTemperature?: {
    CCT?: { value: number };
    Duv?: { value: number };
  };
  flicker?: {
    SVM?: { value: number };
  };
  colorPreference?: {
    PVF?: { value: number };
  };
  photobiologicalSafety?: {
    UV?: { value: number };
  };
}

export interface IAddMetricMetaData {
  metric: string;
  unit?: string;
  information?: string;
  tooltipSummary?: string;
  scale: {
    tooHigh?: string;
    perfect?: string;
    good: string;
    mid?: string;
    tooLow?: string;
  };
}

export interface IUpdateMetricMetaData {
  metric?: string;
  unit?: string;
  information?: string;
  tooltipSummary?: string;
  scale?: {
    tooHigh?: string;
    perfect?: string;
    good: string;
    mid?: string;
    tooLow?: string;
  };
}

export interface IAddWorkOrderInput {
  workOrderID: string;
  lightingAssetID: string;
  workOrderStatus: WorkOrderStatus;
  description: string;
  comment?: string;
  location: Location;
  dateOfMaintenance: Date;
  executionStartDate: Date;
  executedDate: Date;
}
export interface IUpdateWorkOrderInput {
  workOrderID: string;
  lightingAssetID: string;
  type?: WorkOrderType;
  workOrderStatus?: WorkOrderStatus;
  description?: string;
  comment?: string;
  location?: Location;
  dateOfMaintenance?: Date;
  executionStartDate?: Date;
  executedDate?: Date;
}
