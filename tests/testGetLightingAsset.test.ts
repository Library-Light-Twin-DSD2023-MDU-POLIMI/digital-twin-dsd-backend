import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LightingAsset } from '../models'; // Model
import { IAddLightingAssetInput } from '../resolvers/iResolvers/iMutations';
import resolvers from '../resolvers/resolvers';

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

describe('addLightingAsset Resolver', () => {
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/test';
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should get the added lighting asset', async () => {
    const result = await resolvers.Mutation.addLightingAsset(null, {
      input: mockInput,
    });

    // Get LightingAsset by ID
    const dbAsset = await LightingAsset.findById(result._id);

    expect(dbAsset).toBeDefined();
    expect(dbAsset?.uid).toEqual(result.uid);
    expect(dbAsset?._id).toEqual(result._id);
  });
});
