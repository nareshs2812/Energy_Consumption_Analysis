const mongoose = require('mongoose');

const consumptionRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, min: 1, max: 12, required: true },
    year: { type: Number, required: true },
    unitsConsumed: { type: Number, required: true },
    billAmount: { type: Number, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

consumptionRecordSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('ConsumptionRecord', consumptionRecordSchema);

