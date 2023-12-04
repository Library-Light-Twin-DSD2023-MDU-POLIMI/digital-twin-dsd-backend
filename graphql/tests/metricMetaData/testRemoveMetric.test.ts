import mongoose from 'mongoose';
import resolvers from '../resolvers/resolvers';
import { MetricMetaData } from '../models'; // Model
import { IAddMetricMetaData } from '../resolvers/iResolvers/iMutations';

const mockInput: IAddMetricMetaData = {
  metric: 'WATT',
  unit: 'watt',
  scale: {},
  information: 'Info about WATT',
  tooltipSummary: 'Summary WATT',
};

describe('removeMetric Resolver', () => {
  beforeAll(async () => {
    const connectionString = process.env.TEST_DB_CONNECTION_STRING;
    if (!connectionString)
      throw new Error('TEST_DB_CONNECTION_STRING not defined');
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should remove the metric', async () => {
    // Add a new metric
    const addedMetric = await resolvers.Mutation.addMetric(null, {
      input: mockInput,
    });

    // Remove metric
    const removalResult = await resolvers.Mutation.removeMetric(null, {
      metric: addedMetric.metric,
    });

    // Assertions to check if the metric was removed
    expect(removalResult).toBeTruthy();

    // Confirm that the metric no longer exists in the database
    const dbMetric = await MetricMetaData.findOne({
      metric: addedMetric.metric,
    });
    expect(dbMetric).toBeNull();
  });
});
