import express  from "express";

import PayRangeController from '@controllers/payrange.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createPayRange,updatePayRange,deletePayRange} from "@validators/payrange.validator"
const route=express.Router();

route.get('/search',passportJwt, PayRangeController.search);
route.get('/datatable',passportJwt,PayRangeController.datatable)
route.get('/count',passportJwt,PayRangeController.count)
route.get('/',passportJwt,PayRangeController.getPayRanges)
route.get('/:id',passportJwt,PayRangeController.getPayRange)
route.post('/',passportJwt,validator(createPayRange),PayRangeController.createPayRange)
route.patch('/:id',passportJwt,validator(updatePayRange),PayRangeController.updatePayRange)
route.delete('/:id',passportJwt,validator(deletePayRange),PayRangeController.deletePayRange)

export default route;

