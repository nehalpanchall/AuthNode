import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (token, userEmail) => {
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
    to: userEmail, // list of receivers
    subject: 'Account Verification Link ✔', // Subject line
    text: `Please click the link below to verify your email: ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
  };

  transporter.sendMail(mailOptions);
};

export default sendEmail;
