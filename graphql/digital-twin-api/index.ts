import LightingAsset, {CurrentStatus, LightingType, PredictiveStatus, Location} from "./models/LightingAsset";
import LightingAssetTimeSeriesData from "./models/LightingAssetTimeSeriesData";
import WorkOrder, {WorkOrderStatus} from "./models/WorkOrder";

import mongoose, { Document, Schema } from "mongoose";

// FIXME the digital-twin-api should work via a series of function to
// interact with the outside world. This use is a placeholder, and any
// reference to the models should not be accessed directly here like this
export {
    LightingAsset,
    LightingAssetTimeSeriesData,
    WorkOrder,
    WorkOrderStatus,
    CurrentStatus,
    LightingType,
    PredictiveStatus,
    Location
}