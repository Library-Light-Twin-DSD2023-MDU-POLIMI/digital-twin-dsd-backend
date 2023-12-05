import mongoose from "mongoose";
import { ILightingAssetMeasurementInput } from "../resolvers/iResolvers/iMutations";
import resolvers from "../resolvers/resolvers";

const mockInput: ILightingAssetMeasurementInput[] = [];

// Get the current date and time
const currentDate = new Date();

for (let i = 0; i < 20; i++) {
  // Create a new Date object from the current date
  const timestamp = new Date(currentDate.getTime());

  // Add 20 minutes multiplied by the iterator to the current date
  // 20 minutes = 1/3 of an hour, for 3 measurements per hour
  timestamp.setMinutes(currentDate.getMinutes() + 20 * i);

  // Pushing a new mock data object into the mockInput array
  mockInput.push({
    assetId: "656494140f014152e06636f3",
    timestamp: timestamp.toISOString(),
    // Following are the mock values for different properties
    illuminance: { maintainedAverage: 100, uniformityRatio: 0.8 },
    glare: { UGR: 19 },
    colorRendering: { CRI: 80 },
    colorTemperature: { CCT: 5000, Duv: 0.003 },
    flicker: { SVM: 0.5 },
    colorPreference: { PVF: 1 },
    photobiologicalSafety: { UV: 0.1 }
  });
}

describe("addLightingAssetMeasurements Resolver", () => {
  beforeAll(async () => {
    // Establish a connection to the MongoDB database before running tests
    const connectionString = "mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/";
    await mongoose.connect(connectionString, {});
    // Empty the collection before tests
    await mongoose.model('LightingAssetTimeSeriesData').deleteMany({});
  });

  afterAll(async () => {
    // Close the MongoDB connection after running tests
    await mongoose.connection.close();
  });

  test("should add 20 new lighting asset measurements", async () => {
    // Inserting the mock data into the database
    const insertionResult = await resolvers.Mutations.LightingAssetTimeSeriesData.addLightingAssetMeasurements(
      null,
      { input: mockInput }
    );

    // Assertions to ensure the insertion was successful
    expect(insertionResult).toBeDefined();
    expect(Array.isArray(insertionResult)).toBe(true);
    expect(insertionResult.length).toBe(mockInput.length);
    
    // Verifying each field of every inserted object
    mockInput.forEach((inputObject, index) => {
      const resultObject = insertionResult[index];
      // Expectations to validate the data integrity
      expect(resultObject.metaData.assetId).toEqual(new mongoose.Types.ObjectId(inputObject.assetId));
      expect(resultObject.timestamp).toEqual(new Date(inputObject.timestamp));
      expect(resultObject.illuminance?.maintainedAverage).toBe(inputObject.illuminance?.maintainedAverage);
      expect(resultObject.illuminance?.uniformityRatio).toBe(inputObject.illuminance?.uniformityRatio);
      expect(resultObject.glare?.UGR).toBe(inputObject.glare?.UGR);
      expect(resultObject.colorRendering?.CRI).toBe(inputObject.colorRendering?.CRI);
      expect(resultObject.colorTemperature?.CCT).toBe(inputObject.colorTemperature?.CCT);
      expect(resultObject.colorTemperature?.Duv).toBe(inputObject.colorTemperature?.Duv);
      expect(resultObject.flicker?.SVM).toBe(inputObject.flicker?.SVM);
      expect(resultObject.colorPreference?.PVF).toBe(inputObject.colorPreference?.PVF);
      expect(resultObject.photobiologicalSafety?.UV).toBe(inputObject.photobiologicalSafety?.UV);
      });
    });
});