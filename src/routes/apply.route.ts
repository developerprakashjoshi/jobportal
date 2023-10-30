import express  from "express";

import ApplyController from '@controllers/apply.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createApply,updateApply,updateCandidateStatus,deleteApply} from "@validators/apply.validator"
const route=express.Router();

route.get('/list/:recruiterId',passportJwt, ApplyController.list);
route.get('/search',passportJwt, ApplyController.search);
route.get('/datatable',passportJwt,ApplyController.datatable)
route.get('/count/:id',passportJwt,ApplyController.countByUserId)
route.get('/count',passportJwt,ApplyController.count)
route.get('/user-data/:userId',passportJwt,ApplyController.getUsersData)
route.get('/',passportJwt,ApplyController.getApplys)
route.get('/:id',passportJwt,ApplyController.getApply)
route.patch('/candidateStatus/:id',passportJwt,validator(updateCandidateStatus),ApplyController.updateCandidateStatus)
route.post('/',passportJwt,validator(createApply),ApplyController.createApply)
route.patch('/:id',passportJwt,validator(updateApply),ApplyController.updateApply)
route.delete('/:id',passportJwt,validator(deleteApply),ApplyController.deleteApply)

export default route;

