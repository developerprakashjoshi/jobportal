import express  from "express";

import InterviewController from '@controllers/interview.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createInterview,updateInterview,deleteInterview,updateInterviewStaus} from "@validators/interview.validator"
const route=express.Router();

route.get('/datatable',passportJwt,InterviewController.datatable)
route.get('/count',passportJwt,InterviewController.count)
route.get('/get-candidateName',passportJwt,InterviewController.getCompanyName)
route.get('/',passportJwt,InterviewController.getInterviews)
route.get('/:id',passportJwt,InterviewController.getInterview)
route.post('/',passportJwt,validator(createInterview),InterviewController.createInterview)
route.patch('/interview-status/:id',passportJwt,validator(updateInterviewStaus),InterviewController.updateInterviewStaus)
route.patch('/:id',passportJwt,validator(updateInterview),InterviewController.updateInterview)
route.delete('/:id',passportJwt,InterviewController.deleteInterview)
export default route;

