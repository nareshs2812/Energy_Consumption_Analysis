const express = require('express');
const auth = require('../middleware/auth');
const { authorizeRoles, USER_ROLES } = require('../middleware/roles');
const { User } = require('../models/User');
const ConsumptionRecord = require('../models/ConsumptionRecord');

const router = express.Router();

const calculateBillAmount = (unitsConsumed) => {
  if (unitsConsumed <= 100) return unitsConsumed * 5;
  if (unitsConsumed <= 300) return 100 * 5 + (unitsConsumed - 100) * 7;
  return 100 * 5 + 200 * 7 + (unitsConsumed - 300) * 10;
};

router.post(
  '/users',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  async (req, res) => {
    const { name, email, password, role, area, city } = req.body;

    if (!name || !email || !password || !role || !area || !city) {
      return res
        .status(400)
        .json({ message: 'Name, email, password, role, area and city are required' });
    }

    if (![USER_ROLES.ADMIN, USER_ROLES.USER].includes(role)) {
      return res.status(400).json({ message: 'Invalid role for creation' });
    }

    try {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        area,
        city,
      });

      return res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        area: user.area,
        city: user.city,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get(
  '/users',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  async (req, res) => {
    try {
      const users = await User.find().select('-password');
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/consumption',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  async (req, res) => {
    const { userId, month, year, unitsConsumed, area, city } = req.body;

    if (!userId || !month || !year || unitsConsumed == null || !area || !city) {
      return res
        .status(400)
        .json({ message: 'userId, month, year, unitsConsumed, area, city are required' });
    }

    try {
      const billAmount = calculateBillAmount(unitsConsumed);

      const record = await ConsumptionRecord.findOneAndUpdate(
        { user: userId, month, year },
        { user: userId, month, year, unitsConsumed, billAmount, area, city },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      return res.status(201).json(record);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Record for this period already exists' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.put(
  '/consumption/:id',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  async (req, res) => {
    const { id } = req.params;
    const { unitsConsumed, area, city } = req.body;

    try {
      const updates = {};
      if (unitsConsumed != null) {
        updates.unitsConsumed = unitsConsumed;
        updates.billAmount = calculateBillAmount(unitsConsumed);
      }
      if (area) updates.area = area;
      if (city) updates.city = city;

      const record = await ConsumptionRecord.findByIdAndUpdate(id, updates, { new: true });
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
      return res.json(record);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get(
  '/consumption',
  auth,
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  async (req, res) => {
    try {
      const records = await ConsumptionRecord.find().populate('user', 'name email area city');
      return res.json(records);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;

