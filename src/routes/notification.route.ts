import express  from "express";

import NotificationController from '@controllers/notification.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createNotification,updateNotification,deleteNotification} from "@validators/notification.validator"
const route=express.Router();

route.get('/datatable',passportJwt,NotificationController.datatable)
route.get('/count',passportJwt,NotificationController.count)
route.get('/',passportJwt,NotificationController.getNotifications)
route.get('/:id',passportJwt,NotificationController.getNotification)
route.get('/my/:id',passportJwt,NotificationController.getMyNotification)
route.post('/',passportJwt,validator(createNotification),NotificationController.createNotification)
route.patch('/:id',passportJwt,validator(updateNotification),NotificationController.updateNotification)
route.delete('/:id',passportJwt,validator(deleteNotification),NotificationController.deleteNotification)
route.get('/count-unread/:id',passportJwt,  NotificationController.countUnread);
route.patch('/update-unread/:id',passportJwt,  NotificationController.updateUnread);
export default route;

