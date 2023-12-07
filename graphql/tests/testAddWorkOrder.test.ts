import mongoose from 'mongoose';
import WorkOrder from '../models/WorkOrder';
import LightingAsset from '../models/LightingAsset';
import resolvers from '../resolvers/resolvers';
import { v4 as uuidv4 } from 'uuid';
import {
  IAddLightingAssetInput,
  IAddWorkOrderInput,
} from '../resolvers/iResolvers/iMutations';

describe('addWorkOrder Resolver', () => {
  let lightingAssetId: string;
  beforeAll(async () => {
    // Connect to your MongoDB instance
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/test';
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    // Cleanup and close the connection
    await WorkOrder.deleteMany({});
    await LightingAsset.deleteOne({
      _id: lightingAssetId,
    });
    await mongoose.connection.close();
  });

  test('should add a new work order', async () => {
    // Create and save a LightingAsset
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
    // Define a mock input for the work order
    const mockWorkOrderInput: IAddWorkOrderInput = {
      workOrderID: 'WO123456',
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

    // Call the resolver
    const result = await resolvers.Mutation.addWorkOrder(null, {
      input: mockWorkOrderInput,
    });

    // Assertions to verify that the work order has been added correctly
    expect(result).toBeDefined();
    expect(result.workOrderID).toBe(mockWorkOrderInput.workOrderID);
    expect(result.workOrderType).toBe(mockWorkOrderInput.workOrderType);
    expect(result.workOrderStatus).toBe(mockWorkOrderInput.workOrderStatus);
    expect(result.description).toBe(mockWorkOrderInput.description);
    //expect(result.location).toEqual(mockWorkOrderInput.location);

    // Optionally, verify that the record exists in the database
    const dbWorkOrder = await WorkOrder.findById(result._id);
    expect(dbWorkOrder).toBeDefined();
  });
});
