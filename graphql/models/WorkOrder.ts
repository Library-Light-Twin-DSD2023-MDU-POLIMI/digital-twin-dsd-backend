import mongoose, { Document, Schema } from 'mongoose';
import { ILightingAsset } from './LightingAsset';
import { Location } from './LightingAsset';
export type WorkOrderStatus = 'SCHEDULED' | 'COMPLETED' | 'NOTCOMPLETED';
export type WorkOrderType = 'CM' | 'PM' | 'PDM'; // New type for work order types

export interface IWorkOrder extends Document {
  workOrderID: string;
  lightingAssetID: ILightingAsset['_id'];
  workOrderType: WorkOrderType;
  workOrderStatus: WorkOrderStatus;
  description: string;
  comment: string;
  location: Location;
  dateOfMaintenance: Date;
  executionStartDate: Date;
  executedDate: Date;
}

const workOrderSchema = new Schema<IWorkOrder>({
  workOrderID: { type: String, required: true, unique: true },
  lightingAssetID: {
    type: Schema.Types.ObjectId,
    ref: 'LightingAsset',
    required: true,
  },
  workOrderType: {
    type: String,
    enum: ['CM', 'PM', 'PDM'],
    required: true,
  },
  workOrderStatus: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'NOTCOMPLETED'],
    required: true,
  },
  description: { type: String, required: true },
  comment: { type: String },
  location: {
    floor: { type: Number, required: true },
    section: { type: String, required: true },
  },
  dateOfMaintenance: { type: Date, required: true },
  executionStartDate: { type: Date },
  executedDate: { type: Date },
});

const WorkOrder = mongoose.model<IWorkOrder>('WorkOrder', workOrderSchema);

export default WorkOrder;
