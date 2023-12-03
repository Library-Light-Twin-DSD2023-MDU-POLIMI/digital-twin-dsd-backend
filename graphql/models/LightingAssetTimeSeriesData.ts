import mongoose, { Document, Schema } from 'mongoose';
import { ILightingAsset } from './LightingAsset'; // Assuming LightingAsset is in the same directory

const healthStatusSchema = {
  type: Number,
  required: true,
  min: 1,
  max: 5,
};

const metricSchema = new Schema({
  value: { type: Number, required: true },
  healthStatus: healthStatusSchema,
});

export interface ILightingAssetTimeSeriesData extends Document {
  timestamp: Date;
  metaData: Object;
  assetId: ILightingAsset['_id'];
  illuminance?: {
    maintainedAverage?: typeof metricSchema;
    uniformityRatio?: typeof metricSchema;
  };
  glare?: {
    UGR?: typeof metricSchema;
  };
  colorRendering?: {
    CRI?: typeof metricSchema;
  };
  colorTemperature?: {
    CCT?: typeof metricSchema;
    Duv?: typeof metricSchema;
  };
  flicker?: {
    SVM?: typeof metricSchema;
  };
  colorPreference?: {
    PVF?: typeof metricSchema;
  };
  photobiologicalSafety?: {
    UV?: typeof metricSchema;
  };
}

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
        maintainedAverage: metricSchema,
        uniformityRatio: metricSchema,
      },
      glare: {
        UGR: metricSchema,
      },
      colorRendering: {
        CRI: metricSchema,
      },
      colorTemperature: {
        CCT: metricSchema,
        Duv: metricSchema,
      },
      flicker: {
        SVM: metricSchema,
      },
      colorPreference: {
        PVF: metricSchema,
      },
      photobiologicalSafety: {
        UV: metricSchema,
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
