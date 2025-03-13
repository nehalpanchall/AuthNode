const userRegister = async (req, res) => {
  // 1. Get the data from request body
  const { userName, email, password } = req.body;

  // 2. Validate data
  if (!userName || !email || !password) {
    res.status(400).json({ message: 'Invalid user info' });
  }
};

export { userRegister };
