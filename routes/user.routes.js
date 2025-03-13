import express from 'express';
import { userRegister, userVerify } from '../controller/user.controller.js';

const route = express.Router();

route.post('/register', userRegister);
route.get('/verify/:token', userVerify);

export default route;
