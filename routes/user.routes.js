import express from 'express';
import { userRegister } from '../controller/user.controller.js';

const route = express.Router();

route.post('/register', userRegister);

export default route;
