import express  from "express";

import CityController from '@controllers/city.controller';
import validator from "@middlewares/validator.middleware";
import {createCity,updateCity,deleteCity} from "@validators/city.validator"
const route=express.Router();

route.get('/datatable',CityController.datatable)
route.get('/name/:cityName',CityController.getCityName)
route.get('/count',CityController.count)
route.get('/',CityController.getCities)
route.get('/:id',CityController.getCity)
route.post('/',validator(createCity),CityController.createCity)
route.patch('/:id',validator(updateCity),CityController.updateCity)
route.delete('/:id',validator(deleteCity),CityController.deleteCity)
export default route;

