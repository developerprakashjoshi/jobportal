import express  from "express";

import InterviewController from '@controllers/interview.controller';
import validator from "@middlewares/validator.middleware";
import {createInterview,updateInterview,deleteInterview,updateInterviewStaus} from "@validators/interview.validator"
const route=express.Router();

route.get('/datatable',InterviewController.datatable)
route.get('/count',InterviewController.count)
route.get('/get-candidateName',InterviewController.getCompanyName)
route.get('/',InterviewController.getInterviews)
route.get('/:id',InterviewController.getInterview)
route.post('/',validator(createInterview),InterviewController.createInterview)
route.patch('/interviewStatus/:candidateId',validator(updateInterviewStaus),InterviewController.updateInterviewStaus)
route.patch('/:id',validator(updateInterview),InterviewController.updateInterview)
route.delete('/:id',validator(deleteInterview),InterviewController.deleteInterview)
export default route;

