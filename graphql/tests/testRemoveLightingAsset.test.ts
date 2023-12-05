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

describe('removeLightingAsset Resolver', () => {
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/';
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should remove the asset', async () => {
    // Add a new asset
    const result = await resolvers.Mutations.addLightingAsset(null, {
      input: mockInput,
    });

    // Remove asset
    const removalResult = await resolvers.Mutations.removeLightingAsset(null, {
      ID: result._id.toString(),
    });

    // Assertions to check if the asset was removed
    expect(removalResult).toBeTruthy();

    // Confirm that the asset no longer exists in the database
    const dbAsset = await LightingAsset.findById(result._id);
    expect(dbAsset).toBeNull();
  });
});
