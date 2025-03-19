import express from 'express';
import {
  userRegister,
  userVerify,
  userLogin,
  userProfile,
} from '../controller/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const route = express.Router();

route.post('/register', userRegister);
route.get('/verify/:token', userVerify);
route.post('/login', userLogin);
route.get('/profile', isLoggedIn, userProfile);

export default route;
