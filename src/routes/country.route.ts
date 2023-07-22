import express  from "express";


import CountryController from '@controllers/country.controller';
import validator from "@middlewares/validator.middleware";
import {createCountry,updateCountry,deleteCountry} from "@validators/country.validator"
const route=express.Router();

route.get('/datatable',CountryController.datatable)
route.get('/count',CountryController.count)
route.get('/',CountryController.getCountries)
route.get('/:id',CountryController.getCountry)
route.post('/',validator(createCountry),CountryController.createCountry)
route.patch('/:id',validator(updateCountry),CountryController.updateCountry)
route.delete('/:id',validator(deleteCountry),CountryController.deleteCountry)
export default route;

