const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware - verifies JWT and attaches user to req.user
 * Looks for token in Authorization header (Bearer <token>) or in req.cookies.token
 */
async function protect(req, res, next) {
  try {
    let token;

    // 1) Check Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2) Fallback to cookie (if you store JWT in cookies)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    const secret = process.env.JWT_SECRET || 'replace_this_with_a_secret';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user (without password) to req
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Authorize middleware - restricts access to specified roles
 * Usage: authorize('admin', 'expert')
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = {
  protect,
  authorize
};
