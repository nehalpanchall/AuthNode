import User from '../model/User.model.js';

const userRegister = async (req, res) => {
  // 1. Get the data from request body
  const { userName, email, password } = req.body;

  // 2. Validate data
  if (!userName || !email || !password) {
    res.status(400).json({ message: 'invalid user info' });
  }

  try {
    // 3. check user is already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'user already exist' });
    }

    console.log(existingUser);

    // 4. if not exist, create new user
    const newUser = await User.create({ userName, email, password });
    if (newUser) {
      res.status(200).json({ message: 'user has been created successfully' });
    }

    console.log(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error in registration process' });
  }
};

export { userRegister };
