export const isLoggedIn = (req, res, next) => {
  // 1. get the JWT token from cookies
  const jwtToken = req.cookies?.jwtToken;

  if (!jwtToken) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  // 2. check JWT token
  // 3. decode JWT token
  // 4. set data in request object

  next();
};
