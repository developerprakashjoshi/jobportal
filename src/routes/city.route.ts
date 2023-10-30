import express  from "express";

import CityController from '@controllers/city.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createCity,updateCity,deleteCity} from "@validators/city.validator"
const route=express.Router();

route.get('/datatable',passportJwt,CityController.datatable)
route.get('/name/:cityName',passportJwt,CityController.getCityName)
route.get('/count',passportJwt,CityController.count)
route.get('/',passportJwt,CityController.getCities)
route.get('/:id',passportJwt,CityController.getCity)
route.post('/',passportJwt,validator(createCity),CityController.createCity)
route.patch('/:id',passportJwt,validator(updateCity),CityController.updateCity)
route.delete('/:id',passportJwt,validator(deleteCity),CityController.deleteCity)
export default route;

