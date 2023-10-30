import express  from "express";

import TweetController from '@controllers/tweet.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createApply,updateApply,deleteApply} from "@validators/apply.validator"
const route=express.Router();

route.post('/account', passportJwt, TweetController.getAccountByType);
route.post('/create-room',passportJwt, TweetController.createRoom);
route.post('/send-message', passportJwt, TweetController.sendMessage);
route.get('/rooms-user/:userId',passportJwt,  TweetController.getUserRooms);
route.get('/rooms-message/:userId', passportJwt, TweetController.getRooms);
route.get('/rooms-search/:roomName', passportJwt, TweetController.getRoomsByName);
route.get('/message-count-read/:userId',passportJwt,  TweetController.readCount);
route.patch('/message-update-read/:userId',passportJwt,  TweetController.readUpdate);

export default route;

