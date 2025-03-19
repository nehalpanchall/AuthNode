export const isLoggedIn = (req, res, next) => {
  // 1. get the JWT token from cookies
  // 2. check JWT token
  // 3. decode JWT token
  // 4. set data in request object

  next();
};
