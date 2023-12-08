import exp from 'constants';
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
    const workOrderInput1: IAddWorkOrderInput = {
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

    const workOrderInput2: IAddWorkOrderInput = {
      workOrderID: 'WO431212',
      lightingAssetID: lightingAssetId, // Convert ObjectId to string
      workOrderType: 'PM', // WorkOrderType
      workOrderStatus: 'NOTCOMPLETED', // WorkOrderStatus
      description: 'Routine maintenance of library lightings',
      comment: 'Check all lights on tables',
      location: {
        floor: 2,
        section: 'B1',
        area: 'East Wing', // Additional field for LocationInput
      },
      dateOfMaintenance: new Date(), // Date object
      executionStartDate: new Date(), // Date object
      executedDate: new Date(), // Date object
    };

    const allPromises: Promise<any>[] = [];
    allPromises.push(
      resolvers.Mutation.addWorkOrder(null, {
        input: workOrderInput1,
      })
    );

    allPromises.push(
      resolvers.Mutation.addWorkOrder(null, {
        input: workOrderInput2,
      })
    );
    await Promise.all(allPromises);
  });

  afterAll(async () => {
    // Cleanup and close the connection
    await WorkOrder.deleteMany({}); // Delete all work orders
    await resolvers.Mutation.removeLightingAsset(null, {
      ID: lightingAssetId,
    });
    await mongoose.connection.close();
  });

  test('should retrieve a single work order by ID', async () => {
    const workOrders = await resolvers.Query.workOrders();
    const sortedWorkOrders = workOrders.sort((a, b) => {
      return a.workOrderID.localeCompare(b.workOrderID);
    });
    if (!workOrders) throw new Error('Work order not found');
    expect(sortedWorkOrders).toBeDefined();
    expect(sortedWorkOrders.length).toBeGreaterThanOrEqual(2); // Assuming at least 2 metrics are seeded
    expect(sortedWorkOrders[0].workOrderID).toBe('WO123457');
    expect(sortedWorkOrders[1].workOrderID).toBe('WO431212');
    expect(sortedWorkOrders[0].lightingAssetID.toString()).toBe(
      lightingAssetId
    );
    expect(sortedWorkOrders[1].lightingAssetID.toString()).toBe(
      lightingAssetId
    );
    expect(sortedWorkOrders[0].workOrderType).toBe('CM');
    expect(sortedWorkOrders[0].workOrderStatus).toBe('SCHEDULED');
    expect(sortedWorkOrders[0].description).toBe(
      'Routine maintenance of lighting system'
    );
    expect(sortedWorkOrders[0].location.area).toBe('North Wing');
    // You can add more checks here based on the fields of your WorkOrder model
  });
});
