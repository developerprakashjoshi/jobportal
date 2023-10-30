import express  from "express";

import ChatController from '@controllers/chat.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createApply,updateApply,deleteApply} from "@validators/apply.validator"
const route=express.Router();

route.post('/',passportJwt, ChatController.createChat);
route.get('/:userId',passportJwt, ChatController.getChats);
route.get('/find/:firstId/:secondId',passportJwt, ChatController.getChat);

export default route;