import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { LightingAsset } from "../models"; // Model
import { IAddLightingAssetInput, ILightingAssetMeasurementInput } from "../resolvers/iResolvers/iMutations";
import resolvers from "../resolvers/resolvers";

// TODO Legge inn to objekter i listen

const mockInput = [
  {
    assetId: "656494140f014152e06636f3", // This already exists in the LightingAsset database as _uid
    timestamp: "2023-03-25T12:00:00.000Z",
    // Example values
    illuminance: {
      maintainedAverage: 100,
      uniformityRatio: 0.8
    },
    glare: {
      UGR: 19
    },
    colorRendering: {
      CRI: 80
    },
    colorTemperature: {
      CCT: 5000,
      Duv: 0.003
    },
    flicker: {
      SVM: 0.5
    },
    colorPreference: {
      PVF: 1
    },
    photobiologicalSafety: {
      UV: 0.1
    }
  }
];

describe("addLightingAssetMeasurements Resolver", () => {
  beforeAll(async () => {
    const connectionString =
      "mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/";
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should add a new lighting asset measurement", async () => {

    const measurementResult = await resolvers.Mutations.LightingAssetTimeSeriesData.addLightingAssetMeasurements(
      null,
      { input: mockInput }
    );

    expect(measurementResult).toBeDefined();
    expect(Array.isArray(measurementResult)).toBe(true);
    expect(measurementResult.length).toBe(mockInput.length);

    const resultObject = measurementResult[0];
    const inputObject = mockInput[0];

    // TODO Compare timestamp and assetID
    // Why is the asset disappearing in the db?

    expect(resultObject.illuminance?.maintainedAverage).toBe(inputObject.illuminance.maintainedAverage);
    expect(resultObject.illuminance?.uniformityRatio).toBe(inputObject.illuminance.uniformityRatio);
    expect(resultObject.glare?.UGR).toBe(inputObject.glare.UGR);
    expect(resultObject.colorRendering?.CRI).toBe(inputObject.colorRendering.CRI);
    expect(resultObject.colorTemperature?.CCT).toBe(inputObject.colorTemperature.CCT);
    expect(resultObject.colorTemperature?.Duv).toBe(inputObject.colorTemperature.Duv);
    expect(resultObject.flicker?.SVM).toBe(inputObject.flicker.SVM);
    expect(resultObject.colorPreference?.PVF).toBe(inputObject.colorPreference.PVF);
    expect(resultObject.photobiologicalSafety?.UV).toBe(inputObject.photobiologicalSafety.UV);

  });
});