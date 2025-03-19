export const isLoggedIn = (req, res, next) => {
  // 1. get the JWT token from cookies
  const jwtToken = req.cookies?.jwtToken;

  // 2. check JWT token
  if (!jwtToken) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  console.log('JWT Token found: ', jwtToken ? 'YES' : 'NO');

  // 3. decode JWT token

  // 4. set data in request object

  next();
};
