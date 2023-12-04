import mongoose from 'mongoose';
import { MetricMetaData } from '../models'; // Model
import { IAddMetricMetaData } from '../resolvers/iResolvers/iMutations';
import resolvers from '../resolvers/resolvers';

const mockInput: IAddMetricMetaData = {
  metric: 'maintainedAverage',
  unit: 'watt',
  scale: {
    tooHigh: '5',
    perfect: '4',
    good: '3',
    mid: '2',
    tooLow: '1',
  },
  information: 'Detailed information about maintained average',
  tooltipSummary: 'Summary of maintained average',
};

describe('addMetric Resolver', () => {
  beforeAll(async () => {
    const connectionString = process.env.TEST_DB_CONNECTION_STRING;
    if (!connectionString)
      throw new Error('TEST_DB_CONNECTION_STRING not defined');
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should add a new metric', async () => {
    const result = await resolvers.Mutation.addMetric(null, {
      input: mockInput,
    });

    expect(result).toBeDefined();
    expect(result.metric).toBe(mockInput.metric);
    expect(result.unit).toBe(mockInput.unit);
    expect(result.scale).toEqual(mockInput.scale);
    expect(result.information).toBe(mockInput.information);
    expect(result.tooltipSummary).toBe(mockInput.tooltipSummary);

    // Optionally, verify that the record exists in the database
    const dbMetric = await MetricMetaData.findOne({ metric: result.metric });
    expect(dbMetric).toBeDefined();
  });
});
