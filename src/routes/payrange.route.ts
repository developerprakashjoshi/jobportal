import express  from "express";

import PayRangeController from '@controllers/payrange.controller';
import validator from "@middlewares/validator.middleware";
import {createPayRange,updatePayRange,deletePayRange} from "@validators/payrange.validator"
const route=express.Router();

route.get('/search', PayRangeController.search);
route.get('/datatable',PayRangeController.datatable)
route.get('/count',PayRangeController.count)
route.get('/',PayRangeController.getPayRanges)
route.get('/:id',PayRangeController.getPayRange)
route.post('/',validator(createPayRange),PayRangeController.createPayRange)
route.patch('/:id',validator(updatePayRange),PayRangeController.updatePayRange)
route.delete('/:id',validator(deletePayRange),PayRangeController.deletePayRange)

export default route;

