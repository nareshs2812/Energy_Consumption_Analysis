const express = require('express');
const auth = require('../middleware/auth');
const ConsumptionRecord = require('../models/ConsumptionRecord');

const router = express.Router();

router.get('/me/consumption', auth, async (req, res) => {
  try {
    const records = await ConsumptionRecord.find({ user: req.user.id }).sort({ year: 1, month: 1 });
    return res.json(records);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me/bills', auth, async (req, res) => {
  try {
    const records = await ConsumptionRecord.find({ user: req.user.id })
      .select('month year billAmount unitsConsumed')
      .sort({ year: 1, month: 1 });
    return res.json(records);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

