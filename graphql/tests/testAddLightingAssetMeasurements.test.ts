/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import { ILightingAssetMeasurementInput } from '../resolvers/iResolvers/iMutations';
import resolvers from '../resolvers/resolvers';

// --------------- MOCK DATA CREATION AND INSERTION --------------- //

const mockInput: ILightingAssetMeasurementInput[] = [];

// Function to generate a random value within a range
const randomValue = (min: number, max: number) => Math.random() * (max - min) + min;

// Get the current date and time
const currentDate = new Date();

// Mock values for the input
for (let i = 0; i < 20; i++) {
  const timestamp = new Date(currentDate.getTime() + i * 20 * 60000); // 20 minutes apart

  mockInput.push({
    assetId: '656494140f014152e06636f3',
    timestamp: timestamp.toISOString(),
    power: { WATT: { value: randomValue(10, 100) } },
    illuminance: {
      maintainedAverage: { value: randomValue(100, 500) },
      uniformityRatio: { value: randomValue(0.5, 1) }
    },
    glare: { UGR: { value: randomValue(10, 30) } },
    colorRendering: { CRI: { value: randomValue(70, 100) } },
    colorTemperature: {
      CCT: { value: randomValue(3000, 6000) },
      Duv: { value: randomValue(0.001, 0.006) }
    },
    flicker: { SVM: { value: randomValue(0.1, 1) } },
    colorPreference: { PVF: { value: randomValue(1, 5) } },
    photobiologicalSafety: { UV: { value: randomValue(0.05, 0.2) } }
  });
}

// --------------- TESTING --------------- //

describe('addLightingAssetMeasurements Resolver', () => {
  beforeAll(async () => {
    console.log('Before con');
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/';
    await mongoose.connect(connectionString, {});
    // Empty the collection before testing
    await mongoose.model('LightingAssetTimeSeriesData').deleteMany({});
  });

  afterAll(async () => {
    // Close the MongoDB connection after running tests
    await mongoose.connection.close();
  });

  test('should add 20 new lighting asset measurements', async () => {
    const insertionResult =
      await resolvers.Mutation.addLightingAssetMeasurements(null, {
        input: mockInput,
      });

    // Assertions to ensure the insertion was successful
    expect(insertionResult).toBeDefined();
    expect(Array.isArray(insertionResult)).toBe(true);
    expect(insertionResult.length).toBe(mockInput.length);

    // Verifying each field of every inserted object
    mockInput.forEach((inputObject, index) => {
      const resultObject = insertionResult[index];

      // Validate the integrity of the assetId and timestamp
      expect(resultObject.metaData.assetId).toEqual(new mongoose.Types.ObjectId(inputObject.assetId));
      expect(resultObject.timestamp).toEqual(new Date(inputObject.timestamp));

      // Validate each metric directly
      if (inputObject.power?.WATT) {
        expect(resultObject.power?.WATT?.value).toBe(inputObject.power.WATT.value);
      }
      if (inputObject.illuminance?.maintainedAverage) {
        expect(resultObject.illuminance?.maintainedAverage?.value).toBe(inputObject.illuminance.maintainedAverage.value);
      }
      if (inputObject.illuminance?.uniformityRatio) {
        expect(resultObject.illuminance?.uniformityRatio?.value).toBe(inputObject.illuminance.uniformityRatio.value);
      }
      if (inputObject.glare?.UGR) {
        expect(resultObject.glare?.UGR?.value).toBe(inputObject.glare.UGR.value);
      }
      if (inputObject.colorRendering?.CRI) {
        expect(resultObject.colorRendering?.CRI?.value).toBe(inputObject.colorRendering.CRI.value);
      }
      if (inputObject.colorTemperature?.CCT) {
        expect(resultObject.colorTemperature?.CCT?.value).toBe(inputObject.colorTemperature.CCT.value);
      }
      if (inputObject.colorTemperature?.Duv) {
        expect(resultObject.colorTemperature?.Duv?.value).toBe(inputObject.colorTemperature.Duv.value);
      }
      if (inputObject.flicker?.SVM) {
        expect(resultObject.flicker?.SVM?.value).toBe(inputObject.flicker.SVM.value);
      }
      if (inputObject.colorPreference?.PVF) {
        expect(resultObject.colorPreference?.PVF?.value).toBe(inputObject.colorPreference.PVF.value);
      }
      if (inputObject.photobiologicalSafety?.UV) {
        expect(resultObject.photobiologicalSafety?.UV?.value).toBe(inputObject.photobiologicalSafety.UV.value);
      }
    });
  });
});