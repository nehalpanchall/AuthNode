import express from 'express';
import { userRegister } from '../controller/user.controller.js';

const route = express.Router();

route.get('/', userRegister);
route.get('/register', userRegister);

export default route;
