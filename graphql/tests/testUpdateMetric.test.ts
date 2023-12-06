import mongoose from 'mongoose';
import MetricMetaData from '../models/MetricMetaData';
import {
  IAddMetricMetaData,
  IUpdateMetricMetaData,
} from '../resolvers/iResolvers/iMutations';
import resolvers from '../resolvers/resolvers';

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
    const connectionString =
      'mongodb+srv://application:lol@dsd.iaano1k.mongodb.net/test';
    await mongoose.connect(connectionString, {});
  });

  afterAll(async () => {
    await MetricMetaData.deleteMany({});
    await mongoose.connection.close();
  });

  test('should update the metric', async () => {
    // Add a new metric
    const addedMetric = await resolvers.Mutations.addMetric(null, {
      input: mockAddInput,
    });

    const updateData: IUpdateMetricMetaData = {
      metric: addedMetric.metric,
      unit: 'kilowatt', // updated unit
      tooltipSummary: 'Updated summary', // updated tooltipSummary
      scale: { ...addedMetric.scale, good: '3.5' }, // updating one scale value
      // information and tooltipSummary fields are not updated
    };

    // Update unit and scale of the new metric
    const updatedMetric = await resolvers.Mutations.updateMetric(null, {
      ID: addedMetric._id.toString(),
      input: updateData,
    });

    if (!updatedMetric) throw new Error('updatedMetric is undefined');
    expect(updatedMetric).toBeDefined();
    expect(updatedMetric.unit).toBe('kilowatt');
    expect(updatedMetric.tooltipSummary).toBe(updateData.tooltipSummary);
    expect(updatedMetric.scale.good).toBe(updateData.scale?.good ?? '3.5');
    // Optionally check if other fields remain unchanged
    expect(updatedMetric.information).toBe(addedMetric.information);
    expect(updatedMetric.tooltipSummary).toBe(addedMetric.tooltipSummary);
  });
});
