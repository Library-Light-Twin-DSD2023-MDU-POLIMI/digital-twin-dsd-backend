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
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/';
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should add a new lighting asset', async () => {
    const result = await resolvers.Mutations.addLightingAsset(null, {
      input: mockInput,
    });

    expect(result).toBeDefined();
    expect(result.uid).toBe(mockInput.uid);
    expect(result.currentStatus).toBe(mockInput.currentStatus);
    // Compare predictiveStatus properties individually
    expect(result.predictiveStatus.status).toBe(
      mockInput.predictiveStatus.status
    );
    // For dates, convert to a common format
    expect(result.predictiveStatus.predictedTime.toISOString()).toBe(
      mockInput.predictiveStatus.predictedTime.toISOString()
    );
    expect(result.type).toBe(mockInput.type);
    expect(result.location.floor).toBe(mockInput.location.floor);
    expect(result.location.section).toBe(mockInput.location.section);
    expect(result.location.area).toBe(mockInput.location.area);

    // Verify that the record exists in the database
    const dbAsset = await LightingAsset.findById(result._id);
    expect(dbAsset).toBeDefined();
  });
});
