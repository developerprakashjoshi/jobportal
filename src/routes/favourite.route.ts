import express  from "express";

import FavouriteController from '@controllers/favourite.controller';
import validator from "@middlewares/validator.middleware";
import {createFavourite,updateFavourite,deleteFavourite} from "@validators/favourite.validator"
const route=express.Router();

route.get('/search', FavouriteController.search);
route.get('/datatable',FavouriteController.datatable)
route.get('/count/:userId',FavouriteController.count)
route.get('/',FavouriteController.getFavourites)
route.get('/:id',FavouriteController.getFavourite)
route.post('/',validator(createFavourite),FavouriteController.createFavourite)
route.patch('/:id',validator(updateFavourite),FavouriteController.updateFavourite)
route.delete('/:id',validator(deleteFavourite),FavouriteController.deleteFavourite)

export default route;

