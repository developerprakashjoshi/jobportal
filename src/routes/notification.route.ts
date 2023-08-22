import express  from "express";

import NotificationController from '@controllers/notification.controller';
import validator from "@middlewares/validator.middleware";
import {createNotification,updateNotification,deleteNotification} from "@validators/notification.validator"
const route=express.Router();

route.get('/datatable',NotificationController.datatable)
route.get('/count',NotificationController.count)
route.get('/',NotificationController.getNotifications)
route.get('/:id',NotificationController.getNotification)
route.get('/my/:id',NotificationController.getMyNotification)
route.post('/',validator(createNotification),NotificationController.createNotification)
route.patch('/:id',validator(updateNotification),NotificationController.updateNotification)
route.delete('/:id',validator(deleteNotification),NotificationController.deleteNotification)
export default route;

