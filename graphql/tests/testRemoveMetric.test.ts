import mongoose from 'mongoose';
import MetricMetaData from '../models/MetricMetaData';
import { IAddMetricMetaData } from '../resolvers/iResolvers/iMutations';
import resolvers from '../resolvers/resolvers';

const mockInput: IAddMetricMetaData = {
  metric: 'WATT',
  unit: 'watt',
  scale: {
    tooHigh: '5',
    perfect: '4',
    good: '3',
    mid: '2',
    tooLow: '1',
  },
  information: 'Info about WATT',
  tooltipSummary: 'Summary WATT',
};

describe('removeMetric Resolver', () => {
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/test';
    if (!connectionString)
      throw new Error('TEST_DB_CONNECTION_STRING not defined');
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should remove the metric', async () => {
    // Add a new metric
    const addedMetric = await resolvers.Mutations.addMetric(null, {
      input: mockInput,
    });

    // Remove metric
    const removalResult = await resolvers.Mutations.removeMetric(null, {
      ID: addedMetric._id.toString(),
    });

    // Assertions to check if the metric was removed
    expect(removalResult).toBeTruthy();

    // Confirm that the metric no longer exists in the database
    const dbMetric = await MetricMetaData.findById(addedMetric._id);
    expect(dbMetric).toBeNull();
  });
});
