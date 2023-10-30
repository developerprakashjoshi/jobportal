import express  from "express";

import JobController from '@controllers/job.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createJob,updateJob,deleteJob,updateApproveStatus,jobUpdateStatus} from "@validators/job.validator"
const route=express.Router();

route.get('/datatable',passportJwt,JobController.datatable)
route.get('/search',passportJwt,JobController.searchJob)
route.get('/search-job',JobController.searchApprovedJob)
route.get('/resume-datatable',passportJwt,JobController.datatableResume)
route.get('/admin-datatable',passportJwt,JobController.datatableAdmin)
route.get('/search-test',passportJwt,JobController.searchApprovedTest)
route.get('/count',passportJwt,JobController.count)
route.get('/',passportJwt,JobController.getJobs)
route.get('/:id',passportJwt,JobController.getJob)
route.patch('/status/:id',passportJwt,validator(jobUpdateStatus),JobController.jobUpdateStatus)
route.delete('/:id',passportJwt,validator(deleteJob),JobController.deleteJob)
route.post('/',passportJwt,validator(createJob),JobController.createJob)
route.patch('/:id',passportJwt,validator(updateJob),JobController.updateJob)
route.patch('/approval/:id',passportJwt,validator(updateApproveStatus),JobController.updateApproveStatus)
export default route;

