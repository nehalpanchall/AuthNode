import express from 'express';
import {
  userRegister,
  userVerify,
  userLogin,
  userProfile,
  userLogout,
  forgotPassword,
  resetPassword,
} from '../controller/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { validation } from '../middleware/validator.middleware.js';
import {
  registrationValidator,
  loginValidator,
  forgotPasswordValidator,
} from '../validator/validations.js';

const route = express.Router();

route.post('/register', registrationValidator(), validation, userRegister);
route.get('/verify/:token', userVerify);
route.post('/login', loginValidator(), validation, userLogin);
route.get('/profile', isLoggedIn, userProfile);
route.get('/logout', isLoggedIn, userLogout);
route.post(
  '/forgotpassword',
  forgotPasswordValidator(),
  validation,
  forgotPassword
);
route.post('/resetpassword/:token', resetPassword);

export default route;
