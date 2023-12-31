import mongoose from 'mongoose';

export interface IMetricMetaData extends Document {
  metric: string;
  unit?: string;
  information?: string;
  tooltipSummary?: string;
  scale: {
    tooHigh?: string;
    perfect?: string;
    good: string;
    mid?: string;
    tooLow?: string;
  };
}
const scaleSchema = new mongoose.Schema({
  tooHigh: { type: String },
  perfect: { type: String },
  good: { type: String, required: true },
  mid: { type: String },
  tooLow: { type: String },
});

const metricSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true,
    enum: [
      'WATT',
      'maintainedAverage',
      'uniformityRatio',
      'UGR',
      'CRI',
      'CCT',
      'Duv',
      'SVM',
      'PVF',
      'UV',
    ],
  },
  scale: scaleSchema,
  unit: { type: String },
  information: { type: String },
  tooltipSummary: { type: String },
});

const MetricMetaData = mongoose.model<IMetricMetaData>(
  'MetricMetaData',
  metricSchema
);

export default MetricMetaData;
