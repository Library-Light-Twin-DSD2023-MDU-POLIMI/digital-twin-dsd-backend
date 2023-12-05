import mongoose from 'mongoose';
import resolvers from '../resolvers/resolvers';
import { LightingAsset } from '../models'; // Model
import {
  IAddLightingAssetInput,
  IUpdateLightingAssetInput,
} from '../resolvers/iResolvers/iMutations';
import { v4 as uuidv4 } from 'uuid';

const mockInput: IAddLightingAssetInput = {
  uid: uuidv4(), // Generates a unique UUID each time
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

describe('updateLightingAsset Resolver', () => {
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/';
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should update the asset', async () => {
    // Add a new asset
    const result = await resolvers.Mutations.addLightingAsset(null, {
      input: mockInput,
    });

    const updateData: IUpdateLightingAssetInput = {
      uid: result.uid,
      currentStatus: 'GOOD',
      predictiveStatus: {
        status: 'WARNING',
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

    const updatedAsset = await resolvers.Mutations.updateLightingAsset(null, {
      ID: result._id,
      input: updateData,
    });
    if (updatedAsset) {
      const plainUpdatedAsset = updatedAsset.toObject();
      expect(plainUpdatedAsset).toBeDefined();
      expect(plainUpdatedAsset?.currentStatus).toBe('GOOD');
      expect(plainUpdatedAsset?.predictiveStatus.status).toBe('WARNING');
    } else {
      expect(updatedAsset).toBeDefined();
    }
  });
});
