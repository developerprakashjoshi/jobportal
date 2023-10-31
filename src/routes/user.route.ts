import express  from "express";
import multer from 'multer';


import UserController from '@controllers/user.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {registerUser, updateBasicInfo,updateAddress,updateEducation,updateExperience, updateSkillSets,updateConfirmStatus,uploadFile,loginUser,updatePassword,forgotPassword, updatePhoneVerify,emailOTP,updateEmailVerify} from "@validators/user.validator"
const route=express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

route.get('/search',passportJwt, UserController.search);
route.get('/datatable',passportJwt,UserController.datatable)
route.get('/admin-datatable',passportJwt,UserController.datatableAdmin)
route.get('/resume-datatable',passportJwt,UserController.datatableResume)
route.get('/test',passportJwt,UserController.test)
route.get('/count',passportJwt,UserController.count)
route.get('/chat-user/:id',passportJwt,UserController.getChatUser)
route.get('/',passportJwt,UserController.getUsers)

route.get('/:id',passportJwt,UserController.getUser)
route.get('/qualification/:id',passportJwt,UserController.getUserQualification)
route.post('/forgot-password',validator(forgotPassword),UserController.forgotPassword)
route.post('/email-otp',validator(emailOTP),UserController.emailOTP)
route.post('/login',validator(loginUser),UserController.login)
route.post('/admin-login',validator(loginUser),UserController.adminLogin)
route.post('/',validator(registerUser),UserController.createUser)
route.patch('/curriculum-vitae/:id',passportJwt,upload.single('file'),UserController.uploadCurriculumVitae)
route.patch('/certificate/:id',passportJwt,upload.single('file'),UserController.uploadCertificate)
route.patch('/avatar/:id',passportJwt,upload.single('file'),validator(uploadFile),UserController.uploadAvatar)
route.patch('/basic-info/:id',passportJwt,validator(updateBasicInfo),UserController.updateBasicInfo)
route.patch('/address/:id',passportJwt,validator(updateAddress),UserController.updateAddress)
route.patch('/education/:id',passportJwt,validator(updateEducation),UserController.updateEducation)
route.patch('/experience/:id',passportJwt,validator(updateExperience),UserController.updateWorkExperience)
route.patch('/skill-sets/:id',passportJwt,validator(updateSkillSets),UserController.updateSkillSets)
route.patch('/confirm-status/:id',passportJwt,validator(updateConfirmStatus),UserController.updateConfirmStatus)
route.patch('/password/:id',validator(updatePassword),UserController.updatePassword)
route.patch('/phone-verify/:id',passportJwt,validator(updatePhoneVerify),UserController.updatePhoneVerify)
route.patch('/email-verify/:id',validator(updateEmailVerify),UserController.updateEmailVerify)
route.patch('/:id',passportJwt,validator(registerUser),UserController.updateUser)
route.delete('/curriculum-vitae/:id',passportJwt,UserController.deleteCurriculumVitae)
route.delete('/:id',passportJwt,UserController.deleteUser)



export default route;

