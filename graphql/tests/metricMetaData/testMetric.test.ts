import mongoose from 'mongoose';
import resolvers from '../resolvers/resolvers';
import { MetricMetaData } from '../models'; // Model

describe('metric Query', () => {
  beforeAll(async () => {
    const connectionString = process.env.TEST_DB_CONNECTION_STRING;
    if (!connectionString) throw new Error('TEST_DB_CONNECTION_STRING not set');
    await mongoose.connect(connectionString, {});

    // Seed the database with a test metric
    await MetricMetaData.create({
      metric: 'WATT',
      unit: 'watt',
      scale: {},
      information: 'Info about WATT',
      tooltipSummary: 'Summary WATT',
    });
  });

  afterAll(async () => {
    // Clean up the test data
    await MetricMetaData.deleteMany({});
    await mongoose.connection.close();
  });

  test('should retrieve a single metric by name', async () => {
    const metricName = 'WATT';
    const metric = await resolvers.Query.metric(null, { metric: metricName });

    expect(metric).toBeDefined();
    expect(metric.metric).toBe(metricName);
    expect(metric.unit).toBe('watt');
    expect(metric.information).toBe('Info about WATT');
    expect(metric.tooltipSummary).toBe('Summary WATT');
    // You can add more checks here if needed
  });
});
