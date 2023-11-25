import mongoose from 'mongoose';
import resolvers from '../resolvers/resolvers'; // Assuming the path is correct
import LightingAsset from '../models/LightingAsset'; // Import your Mongoose model
import { IAddLightingAssetInput } from '../resolvers/iResolvers/iMutations';

const mockInput: IAddLightingAssetInput = {
  uid: '12345',
  currentStatus: 'good',
  predictiveStatus: 'okay',
  type: 'LED',
  location: {
    floor: 1,
    section: 'North Wing',
    area: 'Reception',
  },
};

describe('addLightingAsset Resolver', () => {
  beforeAll(async () => {
    const connectionString = 'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/';
    console.log(connectionString);
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should add a new lighting asset', async () => {
    const result = await resolvers.Mutations.LightingAsset.addLightingAsset(null, { input: mockInput });
    
    expect(result).toBeDefined();
    expect(result.uid).toBe(mockInput.uid);
    expect(result.currentStatus).toBe(mockInput.currentStatus);
    expect(result.predictiveStatus).toBe(mockInput.predictiveStatus);
    expect(result.type).toBe(mockInput.type);
    expect(result.location.floor).toBe(mockInput.location.floor);
    expect(result.location.section).toBe(mockInput.location.section);
    expect(result.location.area).toBe(mockInput.location.area);

    // Optionally, verify that the record exists in the database
    const dbAsset = await LightingAsset.findById(result._id);
    expect(dbAsset).toBeDefined();
  });
});
