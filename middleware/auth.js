const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserSession = require('../models/UserSession');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check session exists and is still active (isActive:true filter prevents
    // logged-out sessions from being reused, which caused "session expired but
    // admin still works" bug)
    const session = await UserSession.findOne({ userId: decoded.userId, token, isActive: true });
    const user = await User.findById(decoded.userId);

    if (!session) {
      return res.status(401).json({ message: 'Session expired or token invalid' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid User or user does not exist' });
    }
    if (user.isBanned) {
      return res.status(401).json({ message: 'User is Banned' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please log in again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Unauthorized Access' });
  }
};
