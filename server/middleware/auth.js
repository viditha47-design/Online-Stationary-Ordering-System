const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const staffOnly = (req, res, next) => {
  if (req.user.role !== 'staff') return res.status(403).json({ message: 'Staff access only' });
  next();
};

module.exports = { authMiddleware, staffOnly };
