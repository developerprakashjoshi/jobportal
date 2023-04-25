import express  from "express";

import AuthController from '../app/Controllers/AuthController';
import {Validator} from "../app/Middlewares/ValidatorMiddleware";

const route=express.Router();
route.post('/signup',Validator('createUser'),AuthController.signup)
route.post('/login',Validator('login'),AuthController.login)
route.get('/logout',AuthController.logout)
route.get('/me',AuthController.me)
route.post('/sendotp',Validator('sendOtp'),AuthController.sendOtp)
route.post('/verifyotp',Validator('verifyOtp'),AuthController.verifyOtp)
export default route;