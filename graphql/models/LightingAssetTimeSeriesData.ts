import mongoose, { Document, Schema } from 'mongoose';
import { ILightingAsset } from './LightingAsset'; // Assuming LightingAsset is in the same directory

export interface ILightingAssetTimeSeriesData extends Document {
  timestamp: Date;
  metaData: Object;
  assetId: ILightingAsset['_id'];
  illuminance?: {
    maintainedAverage?: number;
    uniformityRatio?: number;
    healthStatus?: number;
  };
  glare?: {
    UGR?: number;
    healthStatus?: number;
  };
  colorRendering?: {
    CRI?: number;
    healthStatus?: number;
  };
  colorTemperature?: {
    CCT?: number;
    Duv?: number;
    healthStatus?: number;
  };
  flicker?: {
    SVM?: number;
    healthStatus?: number;
  };
  colorPreference?: {
    PVF?: number;
    healthStatus?: number;
  };
  photobiologicalSafety?: {
    UV?: number;
    healthStatus?: number;
  };
}

const healthStatusSchema = {
  type: Number,
  required: true,
  min: 1,
  max: 5,
};

const lightingAssetTimeSeriesDataSchema =
  new Schema<ILightingAssetTimeSeriesData>(
    {
      timestamp: { type: Date, required: true },
      metaData: {
        assetId: {
          type: Schema.Types.ObjectId,
          ref: 'LightingAsset',
          required: true,
        },
      },
      illuminance: {
        maintainedAverage: { type: Number },
        uniformityRatio: { type: Number },
        healthStatus: { type: healthStatusSchema },
      },
      glare: {
        UGR: { type: Number },
        healthStatus: { type: healthStatusSchema },
      },
      colorRendering: {
        CRI: { type: Number },
        healthStatus: { type: healthStatusSchema },
      },
      colorTemperature: {
        CCT: { type: Number },
        Duv: { type: Number },
        healthStatus: { type: healthStatusSchema },
      },
      flicker: {
        SVM: { type: Number },
        healthStatus: { type: healthStatusSchema },
      },
      colorPreference: {
        PVF: { type: Number },
        healthStatus: { type: healthStatusSchema },
      },
      photobiologicalSafety: {
        UV: { type: Number },
        healthStatus: { type: healthStatusSchema },
      },
    },
    {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'metaData',
        granularity: 'hours',
      },
      expireAfterSeconds: 2628000,
    }
  );

const LightingAssetTimeSeriesData =
  mongoose.model<ILightingAssetTimeSeriesData>(
    'LightingAssetTimeSeriesData',
    lightingAssetTimeSeriesDataSchema
  );

export default LightingAssetTimeSeriesData;
