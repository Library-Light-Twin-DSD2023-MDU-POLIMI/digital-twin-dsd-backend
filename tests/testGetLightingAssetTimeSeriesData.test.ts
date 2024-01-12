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

describe('getLightingAssetTimeSeriesData Resolver', () => {
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/';
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should retrieve time series data for a lighting asset', async () => {
    const assetId = 'YOUR_ASSET_ID';
    const startTime = '2023-01-01T00:00:00Z';
    const endTime = '2023-12-31T23:59:59Z';
    const thresholds = {
      //add threshods
    };

    const dataResult = await resolvers.Query.getLightingAssetTimeSeriesData(
      null,
      {
        assetId,
        startTime,
        endTime,
        thresholds,
      }
    );

    expect(dataResult).toBeDefined();
    expect(Array.isArray(dataResult)).toBe(true);
  });
});
