import mongoose from 'mongoose';
import resolvers from '../resolvers/resolvers';
import { v4 as uuidv4 } from 'uuid';
import {
  IAddLightingAssetInput,
  IAddWorkOrderInput,
} from '../resolvers/iResolvers/iMutations';

describe('removeWorkOrder Resolver', () => {
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
    await mongoose.connection.close();
  });

  test('should remove the work order', async () => {
    // Attempt to remove the work order
    const result = await resolvers.Mutation.removeWorkOrder(null, {
      ID: workOrderId,
    });

    // Assertions
    expect(result).toBeTruthy();

    // Optionally, try to retrieve the deleted work order to ensure it's been removed
    const deletedWorkOrder = await resolvers.Query.workOrder(null, {
      ID: workOrderId,
    });
    expect(deletedWorkOrder).toBeNull();
  });
});
