/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LightingAsset, PredictiveStatus } from '../models';
import resolvers from '../resolvers/resolvers';
import { IAddLightingAssetInput } from '../resolvers/iResolvers/iMutations';
import { ILightingAssetFilter } from '../resolvers/iResolvers/iQueries';

// --------------- MOCK DATA CREATION --------------- //

const mockInput1: IAddLightingAssetInput = {
    uid: uuidv4(),
    currentStatus: 'BROKEN',
    predictiveStatus: {
      status: 'OKAY',
      predictedTime: new Date(),
    },
    type: 'LED',
    location: {
      floor: 5,
      section: 'North Wing',
      area: 'Reception',
    },
    cilLevel: 1,
  };

  const mockInput2: IAddLightingAssetInput = {
    uid: uuidv4(),
    currentStatus: 'WARNING',
    predictiveStatus: {
      status: 'OKAY',
      predictedTime: new Date(),
    },
    type: 'LED',
    location: {
      floor: 5,
      section: 'North Wing',
      area: 'Reception',
    },
    cilLevel: 1,
  };

  const mockInput3: IAddLightingAssetInput = {
    uid: uuidv4(),
    currentStatus: 'WARNING',
    predictiveStatus: {
      status: 'WARNING',
      predictedTime: new Date(),
    },
    type: 'LED',
    location: {
      floor: 5,
      section: 'South Wing',
      area: 'Reception',
    },
    cilLevel: 1,
  };

// --------------- TESTING --------------- //

describe('lightingAssets Resolver', () => {
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/test';
    await mongoose.connect(connectionString, {});

    // Clear the database
    await LightingAsset.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should get lighting assets on floor 5 in section North Wing', async () => {
      const addAsset1 = await resolvers.Mutation.addLightingAsset(null, {
          input: mockInput1
      });

      const addAsset2 = await resolvers.Mutation.addLightingAsset(null, {
          input: mockInput2
      });

      const addAsset3 = await resolvers.Mutation.addLightingAsset(null, {
          input: mockInput3
      });

      // Define the arguments for the resolver
      const args = {
          input: { limit: 10, offset: 0 },
          filter: {floor: 5, section: 'North Wing'}
      };   

      // Call the resolver
      const result = await resolvers.Query.lightingAssets(undefined, args);

      console.log(result);

      // Expect the result to be an array of length 2
      expect(result).toHaveLength(2);

      // Expect the two assets in the result to be on floor 5 in section North Wing
      result.forEach((asset) => {
          expect(asset.location.floor).toBe(5);
          expect(asset.location.section).toBe('North Wing');
      });
  });
});
