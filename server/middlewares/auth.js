// server/middlewares/auth.js
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'
import dotenv from 'dotenv'
dotenv.config({path:'./config/config.env'})

export const createToken = (id, email, role) => {
  const token = jwt.sign(
    {
      id,
      email: email.toLowerCase(),
      role
    },
    process.env.SECRET,
    { expiresIn: '5d' }
  );
  return token;
};

export const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: 'Missing Token'
      });
    }

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: false,
          isLogin: false,
          message: err.message
        });
      }

      // fetch user without password field
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          isLogin: false,
          message: 'User associated with token not found'
        });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const authorizationRoles = (...roles) => {
  return (req, res, next) => {
    // ensure req.user exists (isAuthenticated middleware should run before)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not allowed to access this resource`
      });
    }

    next();
  };
};
