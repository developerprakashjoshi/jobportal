import express  from "express";

import ChatController from '@controllers/chat.controller';
import validator from "@middlewares/validator.middleware";
import {createApply,updateApply,deleteApply} from "@validators/apply.validator"
const route=express.Router();

route.post('/', ChatController.createChat);
route.get('/:userId', ChatController.getChats);
route.get('/find/:firstId/:secondId', ChatController.getChat);

export default route;