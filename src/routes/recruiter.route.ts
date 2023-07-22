import express  from "express";

import RecruiterController from '@controllers/recruiter.controller';
import validator from "@middlewares/validator.middleware";
import {createRecruiter,updateRecruiter,deleteRecruiter} from "@validators/recruiter.validator"
const route=express.Router();

route.get('/datatable',RecruiterController.datatable)
route.get('/count',RecruiterController.count)
route.get('/',RecruiterController.getRecruiters)
route.get('/:id',RecruiterController.getRecruiter)
route.post('/',validator(createRecruiter),RecruiterController.createRecruiter)
route.patch('/:id',validator(updateRecruiter),RecruiterController.updateRecruiter)
route.delete('/:id',validator(deleteRecruiter),RecruiterController.deleteRecruiter)
export default route;

