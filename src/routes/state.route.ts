import express  from "express";

import StateController from '@controllers/state.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createState,updateState,deleteState} from "@validators/state.validator"
const route=express.Router();

route.get('/datatable',passportJwt,StateController.datatable)
route.get('/count',passportJwt,StateController.count)
route.get('/name/:stateName',passportJwt,StateController.getStateName)
route.get('/',passportJwt,StateController.getStates)
route.get('/:id',passportJwt,StateController.getState)
route.post('/',passportJwt,validator(createState),StateController.createState)
route.patch('/:id',passportJwt,validator(updateState),StateController.updateState)
route.delete('/:id',passportJwt,validator(deleteState),StateController.deleteState)
export default route;

