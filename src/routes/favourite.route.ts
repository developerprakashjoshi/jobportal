import express  from "express";

import FavouriteController from '@controllers/favourite.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createFavourite,updateFavourite,deleteFavourite} from "@validators/favourite.validator"
const route=express.Router();

route.get('/search',passportJwt, FavouriteController.search);
route.get('/datatable',passportJwt,FavouriteController.datatable)
route.get('/users-data/:userId',passportJwt,  FavouriteController.getUsersData);
route.get('/count/:userId',passportJwt,FavouriteController.count)
route.get('/',passportJwt,FavouriteController.getFavourites)
route.get('/:id',passportJwt,FavouriteController.getFavourite)
route.post('/',passportJwt,validator(createFavourite),FavouriteController.createFavourite)
route.patch('/:id',passportJwt,validator(updateFavourite),FavouriteController.updateFavourite)
route.delete('/',passportJwt,validator(deleteFavourite),FavouriteController.deleteFavourite)
route.delete('/deleteUser/:userId',passportJwt,FavouriteController.deleteByUserId)

export default route;

