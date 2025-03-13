import User from '../model/User.model.js';

const userRegister = async (req, res) => {
  // 1. Get the data from request body
  const { userName, email, password } = req.body;

  // 2. Validate data
  if (!userName || !email || !password) {
    res.status(400).json({ message: 'Invalid user info' });
  }

  // 3. check user is already exist or not
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'user already exist' });
  }
};

export { userRegister };
