import {
  CurrentStatus,
  LightingType,
  PredictiveStatus,
  Location,
  WorkOrderStatus,
} from '../../models/index';

export interface IAddLightingAssetInput {
  uid: string;
  currentStatus: CurrentStatus;
  predictiveStatus: {
    status: 'OKAY' | 'WARNING';
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
  predictiveStatus?: PredictiveStatus;
  type?: LightingType;
  location?: {
    floor: number;
    section: string;
    area: string;
  };
}

export interface ILightingAssetMeasurementInput {
  assetId: string;
  timestamp: string;
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
  unit: string;
  information: string;
  tooltipSummary: string;
}

export interface IUpdateMetricMetaData {
  metric: string;
  unit?: string;
  information?: string;
  tooltipSummary?: string;
}

export interface IAddWorkOrderInput {
  workOrderID: string;
  lightingAssetID: string;
  workOrderStatus: WorkOrderStatus;
  description: string;
  comment: string;
  location: Location;
  dateOfMaintenance: Date;
}
export interface IUpdateWorkOrderInput {
  workOrderID: string;
  lightingAssetID: string;
  workOrderStatus?: WorkOrderStatus;
  description?: string;
  comment?: string;
  location?: Location;
  dateOfMaintenance?: Date;
}
