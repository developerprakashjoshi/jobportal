import express  from "express";

import PermissionController from '../app/Controllers/PermissionController';
import {Validator} from "../app/Middlewares/ValidatorMiddleware";
import {passportJwt} from "../app/Middlewares/PassportJwtMiddleware";
const route=express.Router();

route.get('/datatable',passportJwt,PermissionController.datatable)
route.get('/count',passportJwt,PermissionController.count)
route.get('/',passportJwt,PermissionController.getUsers)
route.get('/:id',passportJwt,PermissionController.getUser)
route.post('/',passportJwt,Validator('createPermission'),PermissionController.createUser)
route.patch('/:id',passportJwt,Validator('updatePermission'),PermissionController.updateUser)
route.delete('/:id',passportJwt,Validator('deletePermission'),PermissionController.deleteUser)
export default route;

