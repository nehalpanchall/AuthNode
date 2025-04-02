import User from '../model/User.model.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const userRegister = async (req, res) => {
  // 1. Get the data from request body
  const { userName, email, password } = req.body;

  // Removed manual validation

  try {
    // 3. check user is already exist or not
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      // 4. if not exist, create new user
      const newUser = await User.create({ userName, email, password });

      // 5. generate random token using crypto
      const token = crypto.randomBytes(16).toString('hex');

      if (!token) {
        return res.status(400).json({ message: 'Token does not generated' });
      }

      // 6. save the token to the user database
      newUser.verificationToken = token;
      await newUser.save();

      // 7. send token to the user via email (nodemailer and mailtrap)
      await sendEmail(token, newUser.email, 'register');

      return res.status(200).json({
        message: 'User registration completed',
        success: true,
      });
    } else {
      return res.status(400).json({ message: 'user already exist' });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Server error in registration process',
      error: error.message,
    });
  }
};

const userVerify = async (req, res) => {
  const { token } = req.params;

  try {
    const userObj = await User.findOne({ verificationToken: token });

    if (!userObj) {
      return res.status(400).json({ message: 'Invalid or Expired Token' });
    }

    if (userObj.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    userObj.isVerified = true;
    userObj.verificationToken = undefined;
    await userObj.save();

    return res
      .status(200)
      .json({ message: 'User verified successfully', success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong in verify user',
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  // 1. get login data from body
  const { email, password } = req.body;

  try {
    // 3. check user exist in database or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // 4. if exist, check user account is verified or not
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: 'User verification is required before sign in' });
    }

    // 5. if verified, check and compare string password and hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    // console.log('password matched: ', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // 6. generate JWT token and set the data in JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    // 7. set JWT token in cookie-parser as a response
    const cookieOptions = {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    };

    res.cookie('jwtToken', jwtToken, cookieOptions);

    // 8. send success responses
    return res.status(200).json({
      message: 'Login successfully',
      suceess: true,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
        token: jwtToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong in user login',
      suceess: false,
      error: error.message,
    });
  }
};

const userProfile = async (req, res) => {
  // 1. get the user id from request.user object
  const { id } = req.user;

  // 2. validate the user id
  if (!id) {
    return res.status(400).json({ message: 'Invalid user id', success: false });
  }

  try {
    // 3. find user object match with user id and exclude password
    const user = await User.findOne({ _id: id }).select('-password');

    if (!user) {
      return res
        .status(400)
        .json({ message: 'User not found!', success: false });
    }

    // 4. return sucess message with user data except password
    return res
      .status(200)
      .json({ message: 'User profile', success: true, user });
  } catch (error) {
    return res.status(403).json({
      message: 'Something went wrong to access user profile',
      success: false,
    });
  }
};

const userLogout = async (req, res) => {
  try {
    // new Date(0):  January 1, 1970, 00:00:00 UTC
    res.cookie('jwtToken', '', { expires: new Date(0) }); // Unix Time Zero

    return res
      .status(200)
      .json({ message: 'User logged out successfully', success: true });
  } catch (error) {
    return res.status(403).json({
      message: 'Something went wrong while logging out user',
      success: false,
    });
  }
};

const forgotPassword = async (req, res) => {
  // 1. get email id from body
  const { email } = req.body;

  // 2. Removed manual validation

  try {
    // 3. check user exist in db
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        success: false,
      });
    }

    // 4. generate token
    const token = crypto.randomBytes(16).toString('hex');

    console.log('Random Token Generated: ', token ? 'YES' : 'NO');

    // 5. store token and token expiry in database
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 6. send token as reset link via email
    await sendEmail(token, user.email, 'forgotpassword');

    // 7. return success message
    return res.status(200).json({
      message: 'Reset password link has been sent to registered email id',
      success: true,
    });
  } catch (error) {
    return res.status(403).json({
      message: 'Something went wrong in forgot password',
      success: false,
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  // 1. get the data from body
  const { newPassword, confirmPassword } = req.body;

  // 2. validate data
  if (!newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ message: 'passwords are must', success: false });
  }

  // 3. compare passwords
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: 'passwords are not matched', success: false });
  }

  // 4. get the token form params
  const { token } = req.params;

  // 5. validate token
  if (!token) {
    return res.status(400).json({ message: 'Invalid token', success: false });
  }

  try {
    // 6. get the user object based on matched token and token expiry
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 7. validate user
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User not found!', success: false });
    }

    // 8. replace password with new password in user model
    user.password = newPassword;

    // 9. clear reset token and expiry from user model
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 10. send success message to user
    return res.status(200).json({
      message: 'Password has been reset successfully',
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong in reset password!',
      success: false,
      error: error.message,
    });
  }
};

export {
  userRegister,
  userVerify,
  userLogin,
  userProfile,
  userLogout,
  forgotPassword,
  resetPassword,
};
