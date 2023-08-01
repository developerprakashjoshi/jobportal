import express  from "express";

import ApplyController from '@controllers/apply.controller';
import validator from "@middlewares/validator.middleware";
import {createApply,updateApply,updateCandidateStatus,deleteApply} from "@validators/apply.validator"
const route=express.Router();

route.get('/search', ApplyController.search);
route.get('/datatable',ApplyController.datatable)
route.get('/count/:id',ApplyController.countByUserId)
route.get('/count',ApplyController.count)
route.get('/user-data/:userId',ApplyController.getUsersData)
route.get('/',ApplyController.getApplys)
route.get('/:id',ApplyController.getApply)
route.patch('/candidateStatus/:id',validator(updateCandidateStatus),ApplyController.updateCandidateStatus)
route.post('/',validator(createApply),ApplyController.createApply)
route.patch('/:id',validator(updateApply),ApplyController.updateApply)
route.delete('/:id',validator(deleteApply),ApplyController.deleteApply)

export default route;

