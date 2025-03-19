import express from 'express';
import {
  userRegister,
  userVerify,
  userLogin,
  userProfile,
} from '../controller/user.controller.js';

const route = express.Router();

route.post('/register', userRegister);
route.get('/verify/:token', userVerify);
route.post('/login', userLogin);
route.get('/profile', userProfile);

export default route;
