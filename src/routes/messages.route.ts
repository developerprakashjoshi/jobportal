import express  from "express";

import MessagesController  from '@controllers/messages.controller';
import validator from "@middlewares/validator.middleware";
import {createMessage,updateMessages,deleteMessage} from "@validators/message.validator"
const route=express.Router();


route.post('/', MessagesController.createMessages);

route.get('/:chatId', MessagesController.getMessages);
export default route;

