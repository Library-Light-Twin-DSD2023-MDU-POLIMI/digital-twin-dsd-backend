import mongoose, { Document, Schema } from 'mongoose';
import { ILightingAsset } from './LightingAsset';

export type WorkOrderStatus = 'scheduled' | 'completed' | 'notCompleted';
export type WorkOrderType = 'CM' | 'PM' | 'PDM'; // New type for work order types

export interface IWorkOrder extends Document {
  workOrderID: string;
  lightingAssetID: ILightingAsset['_id'];
  type: WorkOrderType;
  workOrderStatus: WorkOrderStatus;
  description: string;
  comment: string;
  location: {
    floor: number;
    section: string;
  };
  dateOfMaintenance: Date;
  excecutionStartDate: Date;
  excecutedDate: Date;
}

const workOrderSchema = new Schema<IWorkOrder>({
  workOrderID: { type: String, required: true, unique: true },
  lightingAssetID: {
    type: Schema.Types.ObjectId,
    ref: 'LightingAsset',
    required: true,
  },
  type: {
    type: String,
    enum: ['CM', 'PM', 'PDM'],
    required: true,
  },
  workOrderStatus: {
    type: String,
    enum: ['scheduled', 'completed', 'notCompleted'], // Updated to match new status values
    required: true,
  },
  description: { type: String, required: true },
  comment: { type: String },
  location: {
    floor: { type: Number, required: true },
    section: { type: String, required: true },
  },
  dateOfMaintenance: { type: Date, required: true },
  excecutionStartDate: { type: Date },
  excecutedDate: { type: Date },
});

const WorkOrder = mongoose.model<IWorkOrder>('WorkOrder', workOrderSchema);

export default WorkOrder;
