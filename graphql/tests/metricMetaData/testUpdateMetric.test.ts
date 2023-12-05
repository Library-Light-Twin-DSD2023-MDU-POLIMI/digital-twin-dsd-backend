import mongoose from 'mongoose';
import { IAddMetricMetaData } from '../../resolvers/iResolvers/iMutations';
import resolvers from '../../resolvers/resolvers';

const mockAddInput: IAddMetricMetaData = {
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

describe('updateMetric Resolver', () => {
  beforeAll(async () => {
    const connectionString = process.env.TEST_DB_CONNECTION_STRING;
    if (!connectionString)
      throw new Error('TEST_DB_CONNECTION_STRING not defined');
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should update the metric', async () => {
    // Add a new metric
    const addedMetric = await resolvers.Mutation.addMetric(null, {
      input: mockAddInput,
    });

    const updateData: IUpdateMetricMetaData = {
      metric: addedMetric.metric,
      unit: 'kilowatt', // updated unit
      scale: { ...addedMetric.scale, good: '3.5' }, // updating one scale value
      // information and tooltipSummary fields are not updated
    };

    // Update unit and scale of the new metric
    const updatedMetric = await resolvers.Mutation.updateMetric(null, {
      input: updateData,
    });

    expect(updatedMetric).toBeDefined();
    expect(updatedMetric.unit).toBe('kilowatt');
    expect(updatedMetric.scale.good).toBe('3.5');
    // Optionally check if other fields remain unchanged
    expect(updatedMetric.information).toBe(addedMetric.information);
    expect(updatedMetric.tooltipSummary).toBe(addedMetric.tooltipSummary);
  });
});
