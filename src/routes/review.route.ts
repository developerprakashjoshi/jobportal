import express  from "express";

import ReviewController from '@controllers/review.controller';
import validator from "@middlewares/validator.middleware";
import {createReview,updateReview,deleteReview} from "@validators/review.validator"
const route=express.Router();

route.get('/datatable',ReviewController.datatable)
route.get('/count',ReviewController.count)
route.get('/',ReviewController.getReviews)
route.get('/:id',ReviewController.getReview)
route.post('/',validator(createReview),ReviewController.createReview)
route.patch('/:id',validator(updateReview),ReviewController.updateReview)
route.delete('/:id',validator(deleteReview),ReviewController.deleteReview)
export default route;

