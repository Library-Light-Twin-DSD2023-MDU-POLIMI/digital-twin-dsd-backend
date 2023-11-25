import {
  CurrentStatus,
  LightingType,
  PredictiveStatus,
  Location,
  WorkOrderStatus
} from "../../digital-twin-api/index";

export interface IAddLightingAssetInput {
  uid: string;
  currentStatus: CurrentStatus;
  predictiveStatus: PredictiveStatus;
  type: LightingType;
  location: {
    floor: number;
    section: string;
    area: string;
  };
}

export interface IUpdateLightingAssetInput {
  uid: string;
  currentStatus: CurrentStatus;
  predictiveStatus: PredictiveStatus;
  location: {
    floor: number;
    section: string;
    area: string;
  };
}

export interface ILightingAssetMeasurementInput {
  assetId: string;
  timestamp: string;
  illuminance?: {
    maintainedAverage?: number;
    uniformityRatio?: number;
  };
  glare?: {
    UGR?: number;
  };
  colorRendering?: {
    CRI?: number;
  };
  colorTemperature?: {
    CCT?: number;
    Duv?: number;
  };
  flicker?: {
    SVM?: number;
  };
  colorPreference?: {
    PVF?: number;
  };
  photobiologicalSafety?: {
    UV?: number;
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
}
export interface IUpdateWorkOrderInput {
  workOrderID: string;
  lightingAssetID: string;
  workOrderStatus: WorkOrderStatus;
  description: string;
  comment: string;
  location: Location;
  dateOfMaintenance: Date;
}
