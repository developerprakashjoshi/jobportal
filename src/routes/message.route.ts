import express  from "express";

import MessageController  from '@controllers/message.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createMessage,updateMessages,deleteMessage} from "@validators/message.validator"
const route=express.Router();

route.get('/datatable',passportJwt,MessageController.datatable)
route.get('/count',passportJwt,MessageController.count)
route.get('/:senderid',passportJwt,MessageController.getMessages)
route.get('/:senderid/:recipientid',passportJwt,MessageController.getMessage)
route.post('/',passportJwt,validator(createMessage),MessageController.createMessage)
route.patch('/:id',passportJwt,validator(updateMessages),MessageController.updateMessages)
route.delete('/:id',passportJwt,validator(deleteMessage),MessageController.deleteMessage)
export default route;

