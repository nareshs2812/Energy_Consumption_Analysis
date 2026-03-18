const { USER_ROLES } = require('../models/User');

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }

  return next();
};

module.exports = {
  authorizeRoles,
  USER_ROLES,
};

