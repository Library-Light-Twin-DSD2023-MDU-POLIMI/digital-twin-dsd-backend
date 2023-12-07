import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import resolvers from '../resolvers/resolvers';
import {
  IAddLightingAssetInput,
  IAddWorkOrderInput,
  IUpdateWorkOrderInput,
} from '../resolvers/iResolvers/iMutations';

describe('updateWorkOrder Resolver', () => {
  let lightingAssetId: string = '';

  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/test';
    await mongoose.connect(connectionString, {});

    // Create a lightingAsset
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
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should update the work order', async () => {
    // Add a new work order
    const workOrderInput: IAddWorkOrderInput = {
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

    const workOrderResult = await resolvers.Mutation.addWorkOrder(null, {
      input: workOrderInput,
    });

    const updateData: IUpdateWorkOrderInput = {
      workOrderID: workOrderResult.workOrderID,
      lightingAssetID: lightingAssetId,
      workOrderType: 'PM', // Example of an update
      workOrderStatus: 'COMPLETED', // Example of an update
      description: 'Updated description',
      dateOfMaintenance: new Date(),
      location: {
        floor: 2,
        section: 'A2',
        area: 'North Wing', // Additional field for LocationInput
      },
    };

    const updatedWorkOrder = await resolvers.Mutation.updateWorkOrder(null, {
      ID: workOrderResult._id.toString(),
      input: updateData,
    });

    // Assertions
    if (updatedWorkOrder) {
      const plainUpdatedWorkOrder = updatedWorkOrder;
      // Enhanced Assertions
      expect(plainUpdatedWorkOrder).toBeDefined();

      // Check if the updated fields match the data sent in the updateData
      expect(plainUpdatedWorkOrder.workOrderStatus).toBe(
        updateData.workOrderStatus
      );
      expect(plainUpdatedWorkOrder.description).toBe(updateData.description);
      expect(plainUpdatedWorkOrder.workOrderType).toBe(
        updateData.workOrderType
      );

      // Checking if the location fields have been updated
      if (updateData.location) {
        expect(plainUpdatedWorkOrder.location.floor).toBe(
          updateData.location.floor
        );
        expect(plainUpdatedWorkOrder.location.section).toBe(
          updateData.location.section
        );
        expect(plainUpdatedWorkOrder.location.area).toBe(
          updateData.location.area
        );
      }

      if (updateData.dateOfMaintenance) {
        expect(updatedWorkOrder.dateOfMaintenance.toISOString()).toBe(
          updateData.dateOfMaintenance.toISOString()
        );
      }
    } else {
      expect(updatedWorkOrder).toBeDefined();
    }
  });
});
