import express  from "express";

import RecruiterController from '@controllers/recruiter.controller';
import validator from "@middlewares/validator.middleware";
import {createRecruiter,updateRecruiter,deleteRecruiter,loginRecruiter,updatePassword,forgotPassword, updatePhoneVerify,emailOTP,updateEmailVerify} from "@validators/recruiter.validator"
const route=express.Router();

route.get('/datatable',RecruiterController.datatable)
route.get('/company-name',RecruiterController.getCompanyName)
route.get('/count',RecruiterController.count)
route.get('/chat-user/:id',RecruiterController.getChatUser)
route.get('/',RecruiterController.getRecruiters)
route.get('/:id',RecruiterController.getRecruiter)
route.post('/forgot-password',validator(forgotPassword),RecruiterController.forgotPassword)
route.post('/email-otp',validator(emailOTP),RecruiterController.emailOTP)
route.post('/login',validator(loginRecruiter),RecruiterController.login)
route.post('/',validator(createRecruiter),RecruiterController.createRecruiter)
route.patch('/password/:id',validator(updatePassword),RecruiterController.updatePassword)
route.patch('/phone-verify/:id',validator(updatePhoneVerify),RecruiterController.updatePhoneVerify)
route.patch('/email-verify/:id',validator(updateEmailVerify),RecruiterController.updatePhoneVerify)
route.patch('/:id',validator(updateRecruiter),RecruiterController.updateRecruiter)
route.delete('/:id',validator(deleteRecruiter),RecruiterController.deleteRecruiter)
export default route;

