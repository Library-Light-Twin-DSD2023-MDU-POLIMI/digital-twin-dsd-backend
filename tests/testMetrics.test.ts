import mongoose from 'mongoose';
import MetricMetaData from '../models/MetricMetaData';
import { IAddMetricMetaData } from '../resolvers/iResolvers/iMutations';
import resolvers from '../resolvers/resolvers';

describe('metrics Query', () => {
  beforeAll(async () => {
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/test';
    await mongoose.connect(connectionString, {});

    // Optionally, seed the database with test data

    const metricInput1: IAddMetricMetaData = {
      metric: 'WATT',
      unit: 'watt',
      scale: {
        good: '3',
      },
      information: 'Info about WATT',
      tooltipSummary: 'Summary WATT',
    };
    const metricInput2: IAddMetricMetaData = {
      metric: 'maintainedAverage',
      unit: 'lux',
      scale: {
        good: '1',
      },
      information: 'Info about maintainedAverage',
      tooltipSummary: 'Summary maintainedAverage',
    };
    const allPromises: Promise<any>[] = [];
    allPromises.push(
      resolvers.Mutation.addMetric(null, { input: metricInput1 })
    );
    allPromises.push(
      resolvers.Mutation.addMetric(null, { input: metricInput2 })
    );

    await Promise.all(allPromises);
  });

  afterAll(async () => {
    // Optionally, clean up the test data
    await MetricMetaData.deleteMany({});
    await mongoose.connection.close();
  });

  test('should retrieve all metrics', async () => {
    const metrics = await resolvers.Query.metrics();

    expect(metrics).toBeDefined();
    expect(metrics.length).toBeGreaterThanOrEqual(2); // Assuming at least 2 metrics are seeded
    expect(metrics[0].metric).toBeDefined();
    expect(metrics[0].unit).toBeDefined();
    expect(metrics[0].information).toBeDefined();
    expect(metrics[0].tooltipSummary).toBeDefined();
    // You can add more specific checks for each metric if necessary
  });
});
