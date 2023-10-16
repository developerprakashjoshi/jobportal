import express  from "express";

import JobController from '@controllers/job.controller';
import validator from "@middlewares/validator.middleware";
import {createJob,updateJob,deleteJob,updateApproveStatus,jobUpdateStatus} from "@validators/job.validator"
const route=express.Router();

route.get('/datatable',JobController.datatable)
route.get('/search',JobController.searchJob)
route.get('/search-job',JobController.searchApprovedJob)
route.get('/resume-datatable',JobController.datatableResume)
route.get('/admin-datatable',JobController.datatableAdmin)
route.get('/search-test',JobController.searchApprovedTest)
route.get('/count',JobController.count)
route.get('/',JobController.getJobs)
route.get('/:id',JobController.getJob)
route.patch('/status/:id',validator(jobUpdateStatus),JobController.jobUpdateStatus)
route.delete('/:id',validator(deleteJob),JobController.deleteJob)
route.post('/',validator(createJob),JobController.createJob)
route.patch('/:id',validator(updateJob),JobController.updateJob)
route.patch('/approval/:id',validator(updateApproveStatus),JobController.updateApproveStatus)
export default route;

