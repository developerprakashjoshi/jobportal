import express  from "express";

import RoleController from '@controllers/role.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createRole,updateRole,deleteRole} from "@validators/role.validator"
const route=express.Router();

route.get('/search',passportJwt, RoleController.search);
route.get('/datatable',passportJwt,RoleController.datatable)
route.get('/count',passportJwt,RoleController.count)
route.get('/',passportJwt,RoleController.getRoles)
route.get('/:id',passportJwt,RoleController.getRole)
route.post('/',passportJwt,validator(createRole),RoleController.createRole)
route.patch('/:id',passportJwt,validator(updateRole),RoleController.updateRole)
route.delete('/:id',passportJwt,validator(deleteRole),RoleController.deleteRole)

export default route;

