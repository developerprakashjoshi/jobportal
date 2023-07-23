import express  from "express";

import MessageController  from '@controllers/message.controller';
import validator from "@middlewares/validator.middleware";
import {createMessage,updateMessages,deleteMessage} from "@validators/message.validator"
const route=express.Router();

route.get('/datatable',MessageController.datatable)
route.get('/count',MessageController.count)
route.get('/:senderid',MessageController.getMessages)
route.get('/:senderid/:recipientid',MessageController.getMessage)
route.post('/',validator(createMessage),MessageController.createMessage)
route.patch('/:id',validator(updateMessages),MessageController.updateMessages)
route.delete('/:id',validator(deleteMessage),MessageController.deleteMessage)
export default route;

