import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const isLoggedIn = (req, res, next) => {
  try {
    // 1. get the JWT token from cookies
    const jwtToken = req.cookies?.jwtToken;

    // 2. check JWT token
    if (!jwtToken) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    console.log('JWT Token found: ', jwtToken ? 'YES' : 'NO');

    // 3. decode JWT token
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // 4. set data in request object
    req.user = decodedToken;

    // jump to the next middleware/controller
    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Authentication failed: Invalid or expired token',
      success: false,
      error: error.message,
    });
  }
};
