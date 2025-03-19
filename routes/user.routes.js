import express from 'express';
import {
  userRegister,
  userVerify,
  userLogin,
  userProfile,
  userLogout,
} from '../controller/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const route = express.Router();

route.post('/register', userRegister);
route.get('/verify/:token', userVerify);
route.post('/login', userLogin);
route.get('/profile', isLoggedIn, userProfile);
route.get('/logout', isLoggedIn, userLogout);

export default route;
