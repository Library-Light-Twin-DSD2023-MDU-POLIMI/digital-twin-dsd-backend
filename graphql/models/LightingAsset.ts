import mongoose, { Document, Schema } from 'mongoose';
import { IWorkOrder } from './WorkOrder';

export interface Location {
  floor: number;
  section: string;
  area: string;
}

export type CurrentStatus = 'good' | 'warning' | 'broken';
export type PredictiveStatus = 'okay' | 'warning';
export type LightingType = 'LED' | 'Other';

const PredictiveStatusTypeSchema = new Schema({
  status: { type: String, enum: ['OKAY', 'WARNING'], required: true },
  predictedTime: { type: Date, required: true },
});
export interface ILightingAsset extends Document {
  uid: string;
  currentStatus: CurrentStatus;
  predictiveStatus: {
    status: 'OKAY' | 'WARNING';
    predictedTime: Date;
  };
  type: LightingType;
  location: Location;
  workOrders: IWorkOrder['_id'][];
}

const lightingAssetSchema = new Schema<ILightingAsset>({
  uid: { type: String, required: true, unique: true },
  currentStatus: {
    type: String,
    enum: ['good', 'warning', 'broken'],
    required: true,
  },
  predictiveStatus: { type: PredictiveStatusTypeSchema, required: true },
  type: { type: String, enum: ['LED', 'Other'], required: true },
  location: {
    floor: { type: Number, required: true },
    section: { type: String, required: true },
    area: { type: String, required: true },
  },
  workOrders: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'WorkOrder',
      },
    ],
  },
});

const LightingAsset = mongoose.model<ILightingAsset>(
  'LightingAsset',
  lightingAssetSchema
);

export default LightingAsset;
