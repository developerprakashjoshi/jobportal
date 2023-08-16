import express  from "express";
import multer from 'multer';


import UserController from '@controllers/user.controller';
import validator from "@middlewares/validator.middleware";
import {registerUser, updateBasicInfo,updateAddress,updateEducation,updateExperience, updateSkillSets,updateConfirmStatus,uploadFile,loginUser,updatePassword,forgotPassword, updatePhoneVerify} from "@validators/user.validator"
const route=express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

route.get('/search', UserController.search);
route.get('/datatable',UserController.datatable)
route.get('/admin-datatable',UserController.datatableAdmin)
route.get('/test',UserController.test)
route.get('/count',UserController.count)
route.get('/chat-user/:id',UserController.getChatUser)
route.get('/',UserController.getUsers)

route.get('/:id',UserController.getUser)
route.post('/forgot-password',validator(forgotPassword),UserController.forgotPassword)
route.post('/login',validator(loginUser),UserController.login)
route.post('/',validator(registerUser),UserController.createUser)
route.patch('/curriculum-vitae/:id',upload.single('file'),UserController.uploadCurriculumVitae)
route.patch('/certificate/:id',upload.single('file'),UserController.uploadCertificate)
route.patch('/avatar/:id',upload.single('file'),validator(uploadFile),UserController.uploadAvatar)
route.patch('/basic-info/:id',validator(updateBasicInfo),UserController.updateBasicInfo)
route.patch('/address/:id',validator(updateAddress),UserController.updateAddress)
route.patch('/education/:id',validator(updateEducation),UserController.updateEducation)
route.patch('/experience/:id',validator(updateExperience),UserController.updateWorkExperience)
route.patch('/skill-sets/:id',validator(updateSkillSets),UserController.updateSkillSets)
route.patch('/confirm-status/:id',validator(updateConfirmStatus),UserController.updateConfirmStatus)
route.patch('/password/:id',validator(updatePassword),UserController.updatePassword)
route.patch('/phone-verify/:id',validator(updatePhoneVerify),UserController.updatePhoneVerify)
route.patch('/:id',validator(registerUser),UserController.updateUser)
route.delete('/curriculum-vitae/:id',UserController.deleteCurriculumVitae)
route.delete('/:id',UserController.deleteUser)

export default route;

