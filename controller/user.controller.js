import User from '../model/User.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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
    if (!existingUser) {
      // 4. if not exist, create new user
      const newUser = await User.create({ userName, email, password });
      if (newUser) {
        res.status(200).json({ message: 'user has been created successfully' });
      }

      // 5. generate random token using crypto
      const token = crypto.randomBytes(16).toString('hex');

      if (!token) {
        res.status(400).json({ message: 'Token does not generated' });
      }

      // 6. save the token to the user database
      newUser.verificationToken = token;
      await newUser.save();

      // 7. send token to the user via email (nodemailer and mailtrap)
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.MAILTRAP_SENDER, // sender address
        to: newUser.email, // list of receivers
        subject: 'Account Verification Link ✔', // Subject line
        text: `Please click the link below to verify your email: ${process.env.BASE_URL}/api/v1/users/${token}`,
      };

      await transporter.sendMail(mailOptions);
    } else {
      res.status(400).json({ message: 'user already exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error in registration process' });
  }
};

export { userRegister };
