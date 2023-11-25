import mongoose, { Document, Schema } from "mongoose";
import { ILightingAsset } from "./LightingAsset";

export type WorkOrderStatus = "scheduled" | "completed" | "notCompleted";
export interface IWorkOrder extends Document {
  workOrderID: string;
  lightingAssetID: ILightingAsset["_id"];
  workOrderStatus: WorkOrderStatus;
  description: string;
  comment: string;
  location: {
    floor: number;
    section: string;
  };
  dateOfMaintenance: Date;
}

const workOrderSchema = new Schema<IWorkOrder>({
  workOrderID: { type: String, required: true, unique: true },
  lightingAssetID: {
    type: Schema.Types.ObjectId,
    ref: "LightingAsset",
    required: true,
  },
  workOrderStatus: {
    type: String,
    enum: ["okay", "warning", "broken"],
    required: true,
  },
  description: { type: String, required: true },
  comment: { type: String },
  location: {
    floor: { type: Number, required: true },
    section: { type: String, required: true },
  },
  dateOfMaintenance: { type: Date, required: true },
});

const WorkOrder = mongoose.model<IWorkOrder>("WorkOrder", workOrderSchema);

export default WorkOrder;
