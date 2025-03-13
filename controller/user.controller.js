const userRegister = async (req, res) => {
  // 1. Get the data from request body
  const { userName, email, password } = req.body;

  res.status(200).json({ message: 'get data from body' });
};

export { userRegister };
