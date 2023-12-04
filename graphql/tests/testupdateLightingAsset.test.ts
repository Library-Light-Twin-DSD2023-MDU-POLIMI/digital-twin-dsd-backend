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
  currentStatus: 'good',
  predictiveStatus: 'okay',
  type: 'LED',
  location: {
    floor: 1,
    section: 'North Wing',
    area: 'Reception',
  },
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
      currentStatus: 'warning',
      predictiveStatus: 'warning',
      type: 'LED',
      location: {
        floor: 1,
        section: 'North Wing',
        area: 'Reception',
      },
    };

    // Update currentStatus and predictiveStatus on the new asset
    const updatedAsset =
      await resolvers.Mutations.LightingAsset.updateLightingAsset(null, {
        ID: result._id,
        input: updateData,
      });

    expect(updatedAsset).toBeDefined();
    expect(updatedAsset?.currentStatus).toBe('warning');
    expect(updatedAsset?.predictiveStatus).toBe('warning');
  });
});
