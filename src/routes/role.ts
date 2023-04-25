import express  from "express";

import RoleController from '../app/Controllers/RoleController';
import {Validator} from "../app/Middlewares/ValidatorMiddleware";
import {passportJwt} from "../app/Middlewares/PassportJwtMiddleware";
const route=express.Router();

route.get('/datatable',passportJwt,RoleController.datatable)
route.get('/count',passportJwt,RoleController.count)
route.get('/',passportJwt,RoleController.getUsers)
route.get('/:id',passportJwt,RoleController.getUser)
route.post('/',passportJwt,Validator('createRole'),RoleController.createUser)
route.patch('/:id',passportJwt,Validator('updateRole'),RoleController.updateUser)
route.delete('/:id',passportJwt,Validator('deleteRole'),RoleController.deleteUser)
export default route;

