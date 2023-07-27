import express  from "express";

import CourseController from '@controllers/course.controller';
import validator from "@middlewares/validator.middleware";
import {createCourse,updateCourse,deleteCourse} from "@validators/course.validator"
const route=express.Router();

route.get('/search', CourseController.search);
route.get('/datatable',CourseController.datatable)
route.get('/count',CourseController.count)
route.get('/',CourseController.getCourses)
route.get('/:id',CourseController.getCourse)
route.post('/',validator(createCourse),CourseController.createCourse)
route.patch('/:id',validator(updateCourse),CourseController.updateCourse)
route.delete('/:id',validator(deleteCourse),CourseController.deleteCourse)

export default route;

