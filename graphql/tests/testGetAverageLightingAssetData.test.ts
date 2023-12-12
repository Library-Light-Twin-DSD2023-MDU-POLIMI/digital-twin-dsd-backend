import mongoose from 'mongoose';
import { ILightingAssetMeasurementInput } from '../resolvers/iResolvers/iMutations';
import resolvers from '../resolvers/resolvers';

// --------------- MOCK DATA CREATION AND INSERTION --------------- //

const mockInput: ILightingAssetMeasurementInput[] = [];
const assetId = '6571f3ee806f96cb8c9249eb'; // This asset exists in the lightingassets collection

const currentDate = new Date(); // Get the current date and time

// First measurement
mockInput.push({
  assetId: assetId,
  timestamp: new Date(currentDate.getTime()).toISOString(),
  power: { WATT: { value: 50 } },
  illuminance: {
    maintainedAverage: { value: 200 },
    uniformityRatio: { value: 0.8 },
  },
  glare: { UGR: { value: 18 } },
  colorRendering: { CRI: { value: 75 } },
  colorTemperature: { CCT: { value: 4000 }, Duv: { value: 0.002 } },
  flicker: { SVM: { value: 0.3 } },
  colorPreference: { PVF: { value: 2 } },
  photobiologicalSafety: { UV: { value: 0.05 } },
});

// Second measurement - 20 minutes later
mockInput.push({
  assetId: assetId,
  timestamp: new Date(currentDate.getTime() + 20 * 60000).toISOString(),
  power: { WATT: { value: 55 } },
  illuminance: {
    maintainedAverage: { value: 250 },
    uniformityRatio: { value: 0.85 },
  },
  glare: { UGR: { value: 17 } },
  colorRendering: { CRI: { value: 80 } },
  colorTemperature: { CCT: { value: 4500 }, Duv: { value: 0.003 } },
  flicker: { SVM: { value: 0.4 } },
  colorPreference: { PVF: { value: 3 } },
  photobiologicalSafety: { UV: { value: 0.06 } },
});

// Third measurement - 40 minutes later
mockInput.push({
  assetId: assetId,
  timestamp: new Date(currentDate.getTime() + 40 * 60000).toISOString(),
  power: { WATT: { value: 60 } },
  illuminance: {
    maintainedAverage: { value: 300 },
    uniformityRatio: { value: 0.9 },
  },
  glare: { UGR: { value: 16 } },
  colorRendering: { CRI: { value: 85 } },
  colorTemperature: { CCT: { value: 5000 }, Duv: { value: 0.004 } },
  flicker: { SVM: { value: 0.5 } },
  colorPreference: { PVF: { value: 4 } },
  photobiologicalSafety: { UV: { value: 0.07 } },
});

// --------------- TESTING --------------- //

describe('getLightingAssetTimeSeriesData Resolver', () => {
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/';
    await mongoose.connect(connectionString, {});
    await mongoose.model('LightingAssetTimeSeriesData').deleteMany({}); // Empty the collection before testing
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should retrieve average data for a lighting asset within a time range', async () => {
    // Insert the mock data into the database
    await resolvers.Mutation.addLightingAssetMeasurements(null, {
      input: mockInput,
    });

    const assetId = '6571f3ee806f96cb8c9249eb'; // This asset exists in the lightingassets collection

    const currentDate = new Date();
    const startTime = new Date(
      currentDate.getTime() - 60 * 60000
    ).toISOString(); // 1 hour before the currentDate
    const endTime = new Date(currentDate.getTime() + 100 * 60000).toISOString(); // 1 hour after the last measurement

    const result = await resolvers.Query.getAverageLightingAssetData(null, {
      assetId: assetId,
      startTime: startTime,
      endTime: endTime,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // Calculated the expected averages manually
    const expectedAverages = {
      averageIlluminance: 250.0,
      averageGlare: 17.0,
      averageColorRendering: 80.0,
      averageColorTemperature: 4500.0,
      averageFlicker: 0.39999999999999997,
      averageColorPreference: 3.0,
      averagePhotobiologicalSafety: 0.06,
    };

    // Assuming 'result' is the array of objects returned by your resolver
    result.forEach(item => {
      expect(item.averageIlluminance).toBe(expectedAverages.averageIlluminance);
      expect(item.averageGlare).toBe(expectedAverages.averageGlare);
      expect(item.averageColorRendering).toBe(
        expectedAverages.averageColorRendering
      );
      expect(item.averageColorTemperature).toBe(
        expectedAverages.averageColorTemperature
      );
      expect(item.averageFlicker).toBe(expectedAverages.averageFlicker);
      expect(item.averageColorPreference).toBe(
        expectedAverages.averageColorPreference
      );
      expect(item.averagePhotobiologicalSafety).toBe(
        expectedAverages.averagePhotobiologicalSafety
      );
    });
  });
});
