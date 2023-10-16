import express  from "express";

import TweetController from '@controllers/tweet.controller';
import validator from "@middlewares/validator.middleware";
import {createApply,updateApply,deleteApply} from "@validators/apply.validator"
const route=express.Router();

route.post('/account',  TweetController.getAccountByType);
route.post('/create-room', TweetController.createRoom);
route.post('/send-message',  TweetController.sendMessage);
route.get('/rooms-user/:userId',  TweetController.getUserRooms);
route.get('/rooms-message/:userId',  TweetController.getRooms);
route.get('/rooms-search/:roomName',  TweetController.getRoomsByName);
route.get('/message-count-read/:userId',  TweetController.readCount);
route.patch('/message-update-read/:userId',  TweetController.readUpdate);

export default route;

