const { isTokenValid } = require('../config/authStore');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token || !isTokenValid(token)) {
    return res.status(401).json({ message: 'Unauthorized, silakan login dulu' });
  }

  return next();
}

module.exports = authMiddleware;
