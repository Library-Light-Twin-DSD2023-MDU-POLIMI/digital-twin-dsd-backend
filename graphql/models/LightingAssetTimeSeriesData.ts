import mongoose, { Document, Schema } from "mongoose";
import { ILightingAsset } from "./LightingAsset"; // Assuming LightingAsset is in the same directory

export interface ILightingAssetTimeSeriesData extends Document {
  timestamp: Date;
  metaData: Object;
  assetId: ILightingAsset["_id"];
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

const lightingAssetTimeSeriesDataSchema =
  new Schema<ILightingAssetTimeSeriesData>(
    {
      timestamp: { type: Date, required: true },
      metaData: {
        assetId: {
          type: Schema.Types.ObjectId,
          ref: "LightingAsset",
          required: true,
        },
      },
      illuminance: {
        maintainedAverage: Number,
        uniformityRatio: Number,
      },
      glare: {
        UGR: Number,
      },
      colorRendering: {
        CRI: Number,
      },
      colorTemperature: {
        CCT: Number,
        Duv: Number,
      },
      flicker: {
        SVM: Number,
      },
      colorPreference: {
        PVF: Number,
      },
      photobiologicalSafety: {
        UV: Number,
      },
    },
    {
      timeseries: {
        timeField: "timestamp",
        metaField: "metaData",
        granularity: "hours",
      },
      expireAfterSeconds: 2628000,
    }
  );

const LightingAssetTimeSeriesData =
  mongoose.model<ILightingAssetTimeSeriesData>(
    "LightingAssetTimeSeriesData",
    lightingAssetTimeSeriesDataSchema
  );

export default LightingAssetTimeSeriesData;
