import express  from "express";

import UserController from '../app/Controllers/UserController';
import {Validator} from "../app/Middlewares/ValidatorMiddleware";
import {passportJwt} from "../app/Middlewares/PassportJwtMiddleware";
const route=express.Router();

route.get('/datatable',passportJwt,UserController.datatable)
route.get('/count',passportJwt,UserController.count)
route.get('/',passportJwt,UserController.getUsers)
route.get('/:id',passportJwt,UserController.getUser)
route.post('/',passportJwt,Validator('createUser'),UserController.createUser)
route.patch('/:id',passportJwt,Validator('updateUser'),UserController.updateUser)
route.delete('/:id',passportJwt,Validator('deleteUser'),UserController.deleteUser)
export default route;

