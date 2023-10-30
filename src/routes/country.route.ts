import express  from "express";


import CountryController from '@controllers/country.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createCountry,updateCountry,deleteCountry} from "@validators/country.validator"
const route=express.Router();

route.get('/datatable',passportJwt,CountryController.datatable)
route.get('/count',passportJwt,CountryController.count)
route.get('/',passportJwt,CountryController.getCountries)
route.get('/:id',passportJwt,CountryController.getCountry)
route.post('/',passportJwt,validator(createCountry),CountryController.createCountry)
route.patch('/:id',passportJwt,validator(updateCountry),CountryController.updateCountry)
route.delete('/:id',passportJwt,validator(deleteCountry),CountryController.deleteCountry)
export default route;

