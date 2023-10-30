import express  from "express";

import CourseController from '@controllers/course.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createCourse,updateCourse,deleteCourse} from "@validators/course.validator"
const route=express.Router();

route.get('/search',passportJwt, CourseController.search);
route.get('/datatable',passportJwt,CourseController.datatable)
route.get('/count',passportJwt,CourseController.count)
route.get('/',passportJwt,CourseController.getCourses)
route.get('/:id',passportJwt,CourseController.getCourse)
route.post('/',passportJwt,validator(createCourse),CourseController.createCourse)
route.patch('/:id',passportJwt,validator(updateCourse),CourseController.updateCourse)
route.delete('/:id',passportJwt,validator(deleteCourse),CourseController.deleteCourse)

export default route;

