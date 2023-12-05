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
  location: {
    floor: number;
    section: string;
    area: string;
  };
}

export interface IUpdateLightingAssetInput {
  uid: string;
  currentStatus?: CurrentStatus;
  predictiveStatus?: {
    status: PredictiveStatus;
    predictedTime: Date;
  };
  type?: LightingType;
  location?: {
    floor: number;
    section: string;
    area: string;
  };
  cilLevel?: 1 | 2;
}

export interface ILightingAssetMeasurementInput {
  assetId: string;
  timestamp: string;
  power?: {
    WATT?: { value: number };
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

export interface IAddWorkOrderInput {
  workOrderID: string;
  lightingAssetID: string;
  workOrderStatus: WorkOrderStatus;
  description: string;
  comment: string;
  location: Location;
  dateOfMaintenance: Date;
  executionStartDate: Date;
  executedDate: Date;
}
export interface IUpdateWorkOrderInput {
  workOrderID: string;
  lightingAssetID: string;
  type: WorkOrderType;
  workOrderStatus: WorkOrderStatus;
  description: string;
  comment: string;
  location: Location;
  dateOfMaintenance: Date;
  executionStartDate: Date;
  executedDate: Date;
}
