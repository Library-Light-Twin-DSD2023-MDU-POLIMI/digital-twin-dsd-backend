const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true,
    enum: [
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
  unit: { type: String, required: true },
  information: { type: String, required: true },
  tooltipSummary: { type: String, required: true },
});

const MetricMetaData = mongoose.model('MetricMetaData', metricSchema);

module.exports = MetricMetaData;
