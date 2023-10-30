import express  from "express";

import MessagesController  from '@controllers/messages.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createMessage,updateMessages,deleteMessage} from "@validators/message.validator"
const route=express.Router();


route.post('/',passportJwt, MessagesController.createMessages);

route.get('/:chatId',passportJwt, MessagesController.getMessages);
export default route;

