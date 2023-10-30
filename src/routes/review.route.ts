import express  from "express";

import ReviewController from '@controllers/review.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createReview,updateReview,deleteReview} from "@validators/review.validator"
const route=express.Router();

route.get('/datatable',passportJwt,ReviewController.datatable)
route.get('/count',passportJwt,ReviewController.count)
route.get('/',passportJwt,ReviewController.getReviews)
route.get('/:id',passportJwt,ReviewController.getReview)
route.post('/',passportJwt,validator(createReview),ReviewController.createReview)
route.patch('/:id',passportJwt,validator(updateReview),ReviewController.updateReview)
route.delete('/:id',passportJwt,validator(deleteReview),ReviewController.deleteReview)
export default route;

