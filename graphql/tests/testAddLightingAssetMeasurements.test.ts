import mongoose from "mongoose";
import { ILightingAssetMeasurementInput, ILightingAssetMeasurementMetric } from "../resolvers/iResolvers/iMutations";
import resolvers from "../resolvers/resolvers";

const mockInput: ILightingAssetMeasurementInput[] = [];

// Get the current date and time
const currentDate = new Date();

// Function to create a mock metric
const createMockMetric = (value: number): ILightingAssetMeasurementMetric => ({
  value,
  healthStatus: Math.floor(Math.random() * 5) + 1, // Random number between 1 and 5
});

for (let i = 0; i < 20; i++) {
  // Create a new Date object from the current date
  const timestamp = new Date(currentDate.getTime());

  // Add 20 minutes multiplied by the iterator to the current date
  timestamp.setMinutes(currentDate.getMinutes() + 20 * i);

  // Pushing a new mock data object into the mockInput array
  mockInput.push({
    assetId: "656494140f014152e06636f3",
    timestamp: timestamp.toISOString(),
    // Following are the mock values for different properties
    power: { WATT: createMockMetric(50) },
    illuminance: { 
      maintainedAverage: createMockMetric(100),
      uniformityRatio: createMockMetric(0.8)
    },
    glare: { UGR: createMockMetric(19) },
    colorRendering: { CRI: createMockMetric(80) },
    colorTemperature: { 
      CCT: createMockMetric(5000),
      Duv: createMockMetric(0.003)
    },
    flicker: { SVM: createMockMetric(0.5) },
    colorPreference: { PVF: createMockMetric(1) },
    photobiologicalSafety: { UV: createMockMetric(0.1) }
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
    const insertionResult = await resolvers.Mutation.addLightingAssetMeasurements(
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

      // Validate nested metric structure
      const validateMetric = (resultMetric: ILightingAssetMeasurementMetric | undefined, inputMetric: ILightingAssetMeasurementMetric | undefined) => {
        if (resultMetric && inputMetric) {
          expect(resultMetric.value).toBe(inputMetric.value);
          expect(resultMetric.healthStatus).toBe(inputMetric.healthStatus);
        }
      };

      // Apply validateMetric to each property, ensuring both result and input have the property
      if (resultObject.power?.WATT && inputObject.power?.WATT) {
        validateMetric(resultObject.power.WATT, inputObject.power.WATT);
      }
      if (resultObject.illuminance?.maintainedAverage && inputObject.illuminance?.maintainedAverage) {
        validateMetric(resultObject.illuminance.maintainedAverage, inputObject.illuminance.maintainedAverage);
      }
      if (resultObject.illuminance?.uniformityRatio && inputObject.illuminance?.uniformityRatio) {
        validateMetric(resultObject.illuminance.uniformityRatio, inputObject.illuminance.uniformityRatio);
      }

      // ... Continue for other properties like glare, colorRendering, etc.
      });
    });
});