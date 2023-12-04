const mongoose = require('mongoose');

const scaleSchema = new mongoose.Schema({
  tooHigh: { type: String },
  perfect: { type: String },
  good: { type: String },
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
  unit: { type: String, required: true },
  information: { type: String, required: true },
  tooltipSummary: { type: String, required: true },
});

const MetricMetaData = mongoose.model('MetricMetaData', metricSchema);

module.exports = MetricMetaData;
