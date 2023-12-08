import mongoose, { Document, Schema } from 'mongoose';
import { IWorkOrder } from './WorkOrder';

export interface Location {
  floor: number;
  section: string;
  area: string;
}

export type CurrentStatus = 'GOOD' | 'WARNING' | 'BROKEN';
export type PredictiveStatus = 'OKAY' | 'WARNING';
export type LightingType = 'LED' | 'OTHER';

const PredictiveStatusTypeSchema = new Schema({
  status: { type: String, enum: ['OKAY', 'WARNING'], required: true },
  predictedTime: { type: Date, required: true },
});
export interface ILightingAsset extends Document {
  uid: string;
  currentStatus: CurrentStatus;
  predictiveStatus: {
    status: PredictiveStatus;
    predictedTime: Date;
  };
  type: LightingType;
  location: Location;
  cilLevel: 1 | 2;
  workOrders: IWorkOrder['_id'][];
}

const lightingAssetSchema = new Schema<ILightingAsset>({
  uid: { type: String, required: true, unique: true },
  currentStatus: {
    type: String,
    enum: ['GOOD', 'WARNING', 'BROKEN'],
    required: true,
  },
  predictiveStatus: { type: PredictiveStatusTypeSchema, required: true },
  type: { type: String, enum: ['LED', 'OTHER'], required: true },
  cilLevel: { type: Number, enum: [1, 2], required: true },
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
