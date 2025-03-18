import express from 'express';
import {
  userRegister,
  userVerify,
  userLogin,
} from '../controller/user.controller.js';

const route = express.Router();

route.post('/register', userRegister);
route.get('/verify/:token', userVerify);
route.post('/login', userLogin);

export default route;
