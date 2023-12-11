import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LightingAsset } from '../models';
import WorkOrder from '../models/WorkOrder'; // Replace with your actual WorkOrder model path
import {
  IAddLightingAssetInput,
  IAddWorkOrderInput,
} from '../resolvers/iResolvers/iMutations';
import resolvers from '../resolvers/resolvers';

describe('workOrder Query', () => {
  let workOrderId: string;
  let lightingAssetId: string;
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/test';
    await mongoose.connect(connectionString, {});

    const mockInput: IAddLightingAssetInput = {
      uid: uuidv4(),
      currentStatus: 'GOOD',
      predictiveStatus: {
        status: 'OKAY',
        predictedTime: new Date(),
      },
      type: 'LED',
      location: {
        floor: 1,
        section: 'North Wing',
        area: 'Reception',
      },
      cilLevel: 1,
    };

    const lightingAsset = await resolvers.Mutation.addLightingAsset(null, {
      input: mockInput,
    });
    lightingAssetId = lightingAsset._id.toString();
    // Create a workOrder
    const workOrderInput: IAddWorkOrderInput = {
      workOrderID: 'WO123457',
      lightingAssetID: lightingAssetId, // Convert ObjectId to string
      workOrderType: 'CM', // WorkOrderType
      workOrderStatus: 'SCHEDULED', // WorkOrderStatus
      description: 'Routine maintenance of lighting system',
      comment: 'Check all lights',
      location: {
        floor: 1,
        section: 'A1',
        area: 'North Wing', // Additional field for LocationInput
      },
      dateOfMaintenance: new Date(), // Date object
      executionStartDate: new Date(), // Date object
      executedDate: new Date(), // Date object
    };

    const workOrder = await resolvers.Mutation.addWorkOrder(null, {
      input: workOrderInput,
    });
    workOrderId = workOrder._id.toString();
  });

  afterAll(async () => {
    // Cleanup and close the connection
    await WorkOrder.findByIdAndDelete(workOrderId);
    await LightingAsset.deleteOne({
      _id: lightingAssetId,
    });
    await mongoose.connection.close();
  });

  test('should retrieve a single work order by ID', async () => {
    const workOrder = await resolvers.Query.workOrder(null, {
      ID: workOrderId,
    });
    if (!workOrder) throw new Error('Work order not found');
    expect(workOrder).toBeDefined();
    expect(workOrder.workOrderID).toBe('WO123457');
    expect(workOrder.workOrderType).toBe('CM');
    expect(workOrder.workOrderStatus).toBe('SCHEDULED');
    expect(workOrder.description).toBe(
      'Routine maintenance of lighting system'
    );
    expect(workOrder.location.area).toBe('North Wing');
    // You can add more checks here based on the fields of your WorkOrder model
  });
});
