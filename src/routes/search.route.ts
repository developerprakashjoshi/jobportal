import express  from "express";

import SearchController from '@controllers/search.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createSearch,updateSearch,deleteSearch} from "@validators/search.validator"
const route=express.Router();

route.get('/search',passportJwt, SearchController.search);
route.get('/datatable',passportJwt,SearchController.datatable)
route.get('/count',passportJwt,SearchController.count)
route.get('/',SearchController.getSearchs)
route.get('/:id',passportJwt,SearchController.getSearch)
route.post('/',validator(createSearch),SearchController.createSearch)
route.patch('/:id',passportJwt,validator(updateSearch),SearchController.updateSearch)
route.delete('/:id',passportJwt,validator(deleteSearch),SearchController.deleteSearch)

export default route;

