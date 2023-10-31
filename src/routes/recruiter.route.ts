import express  from "express";

import RecruiterController from '@controllers/recruiter.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createRecruiter,updateRecruiter,deleteRecruiter,loginRecruiter,updatePassword,forgotPassword, updatePhoneVerify,emailOTP,updateEmailVerify} from "@validators/recruiter.validator"
const route=express.Router();

route.get('/datatable',passportJwt,RecruiterController.datatable)
route.get('/company-name',passportJwt,RecruiterController.getCompanyName)
route.get('/count',passportJwt,RecruiterController.count)
route.get('/chat-user/:id',passportJwt,RecruiterController.getChatUser)
route.get('/',passportJwt,RecruiterController.getRecruiters)
route.get('/:id',passportJwt,RecruiterController.getRecruiter)
route.post('/forgot-password',validator(forgotPassword),RecruiterController.forgotPassword)
route.post('/email-otp',validator(emailOTP),RecruiterController.emailOTP)
route.post('/login',validator(loginRecruiter),RecruiterController.login)
route.post('/',validator(createRecruiter),RecruiterController.createRecruiter)
route.patch('/password/:id',validator(updatePassword),RecruiterController.updatePassword)
route.patch('/phone-verify/:id',passportJwt,validator(updatePhoneVerify),RecruiterController.updatePhoneVerify)
route.patch('/email-verify/:id',passportJwt,validator(updateEmailVerify),RecruiterController.updatePhoneVerify)
route.patch('/:id',passportJwt,validator(updateRecruiter),RecruiterController.updateRecruiter)
route.delete('/:id',passportJwt,validator(deleteRecruiter),RecruiterController.deleteRecruiter)
export default route;

