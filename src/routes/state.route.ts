import express  from "express";

import StateController from '@controllers/state.controller';
import validator from "@middlewares/validator.middleware";
import {createState,updateState,deleteState} from "@validators/state.validator"
const route=express.Router();

route.get('/datatable',StateController.datatable)
route.get('/count',StateController.count)
route.get('/name/:stateName',StateController.getStateName)
route.get('/',StateController.getStates)
route.get('/:id',StateController.getState)
route.post('/',validator(createState),StateController.createState)
route.patch('/:id',validator(updateState),StateController.updateState)
route.delete('/:id',validator(deleteState),StateController.deleteState)
export default route;

