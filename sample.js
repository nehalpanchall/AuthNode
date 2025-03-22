const forgotPassword = async (req, res) => {
  // 1. extract the email id from body
  const { email } = req.body;

  // 2. validate email id
  if (!email) {
    return res
      .status(400)
      .json({ message: 'Invalid email id', success: false });
  }

  try {
    // 3. check if email if exist or not
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'User does not exist', success: false });
    }

    // 4. if exist, generate password reset token
    const token = crypto.randomBytes(16).toString('hex');

    // 5. save password reset token in database and set password reset expiry
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expire in 10 mins
    user.save();

    // 6. send password reset token to user via email (create custom route URL and send in email)
    sendEmail(token, user.email, 'resetpassword');

    return res.status(200).json({
      message: 'Link to reset password has been sent',
      success: true,
    });
  } catch (error) {}
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Invalid token', success: false });
  }

  if (!password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: 'New password is required', success: false });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Password is not matched', success: false });
  }

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token', success: false });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();

    return res
      .status(200)
      .json({ message: 'Password reset successfully', success: true });
  } catch (error) {
    return res
      .status(403)
      .json({ message: 'Something wrong in reset password', success: false });
  }
};
