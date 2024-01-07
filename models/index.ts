import LightingAsset, {
  CurrentStatus,
  LightingType,
  Location,
  PredictiveStatus,
  CILLevel,
} from './LightingAsset';
import LightingAssetTimeSeriesData from './LightingAssetTimeSeriesData';
import WorkOrder, { WorkOrderStatus } from './WorkOrder';

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
  Location,
  CILLevel,
};
