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

  // 2. Validate data
  if (!userName || !email || !password) {
    return res.status(400).json({ message: 'invalid user info' });
  }

  try {
    // 3. check user is already exist or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      // 4. if not exist, create new user
      const newUser = await User.create({ userName, email, password });
      if (newUser) {
        return res
          .status(200)
          .json({ message: 'user has been created successfully' });
      }

      // 5. generate random token using crypto
      const token = crypto.randomBytes(16).toString('hex');

      if (!token) {
        return res.status(400).json({ message: 'Token does not generated' });
      }

      // 6. save the token to the user database
      newUser.verificationToken = token;
      await newUser.save();

      // 7. send token to the user via email (nodemailer and mailtrap)
      await sendEmail(token, newUser.email);

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

  // 2. validate data
  if (!email || !password) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

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
  // 2. validate email
  // 3. check user exist in db
  // 4. generate token
  // 5. store token and token expiry in database
  // 6. send token as reset link via email
  // 7. return success message
};

export {
  userRegister,
  userVerify,
  userLogin,
  userProfile,
  userLogout,
  forgotPassword,
};
