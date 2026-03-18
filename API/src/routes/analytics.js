const express = require('express');
const auth = require('../middleware/auth');
const { authorizeRoles, USER_ROLES } = require('../middleware/roles');
const ConsumptionRecord = require('../models/ConsumptionRecord');

const router = express.Router();

router.get(
  '/area-wise',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  async (req, res) => {
    try {
      const result = await ConsumptionRecord.aggregate([
        {
          $group: {
            _id: '$area',
            totalUnits: { $sum: '$unitsConsumed' },
            totalBill: { $sum: '$billAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { totalUnits: -1 } },
      ]);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get(
  '/city-wise',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  async (req, res) => {
    try {
      const result = await ConsumptionRecord.aggregate([
        {
          $group: {
            _id: '$city',
            totalUnits: { $sum: '$unitsConsumed' },
            totalBill: { $sum: '$billAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { totalUnits: -1 } },
      ]);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get(
  '/user-wise',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  async (req, res) => {
    try {
      const result = await ConsumptionRecord.aggregate([
        {
          $group: {
            _id: '$user',
            totalUnits: { $sum: '$unitsConsumed' },
            totalBill: { $sum: '$billAmount' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            totalUnits: 1,
            totalBill: 1,
            name: '$user.name',
            email: '$user.email',
            area: '$user.area',
            city: '$user.city',
          },
        },
        { $sort: { totalUnits: -1 } },
      ]);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get(
  '/monthly-trends',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  async (req, res) => {
    try {
      const result = await ConsumptionRecord.aggregate([
        {
          $group: {
            _id: { year: '$year', month: '$month' },
            totalUnits: { $sum: '$unitsConsumed' },
            totalBill: { $sum: '$billAmount' },
          },
        },
        {
          $project: {
            year: '$_id.year',
            month: '$_id.month',
            totalUnits: 1,
            totalBill: 1,
            _id: 0,
          },
        },
        { $sort: { year: 1, month: 1 } },
      ]);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get(
  '/extremes',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  async (req, res) => {
    try {
      const aggregated = await ConsumptionRecord.aggregate([
        {
          $group: {
            _id: '$user',
            totalUnits: { $sum: '$unitsConsumed' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            totalUnits: 1,
            name: '$user.name',
            email: '$user.email',
          },
        },
        { $sort: { totalUnits: -1 } },
      ]);

      if (!aggregated.length) {
        return res.json({ highest: null, lowest: null });
      }

      const highest = aggregated[0];
      const lowest = aggregated[aggregated.length - 1];

      return res.json({ highest, lowest });
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;

