import Joi from "joi";

export const createCourse = Joi.object({
  alphaLearnCourse: Joi.boolean().required(),
  availableFrom: Joi.date().required(),
  availableTill :Joi.date().required(),
  avgRating:Joi.number().required(),
  courseCode:Joi.string().required(),
  courseId:Joi.number().required(),
  courseType:Joi.string().required(),
  currency:Joi.string().required(),
  description:Joi.string().required(),
  price:Joi.string().valid("totalPrice","discountPrice","basePrice").required(),
  status: Joi.string().valid("Active","Inactive").required(),
  thumbnail:Joi.string().required(),
  createdBy:Joi.string().required(),
}).options({ abortEarly: false });

export const updateCourse = Joi.object({
  id:Joi.string().required(),
  alphaLearnCourse: Joi.boolean().optional(),
  availableFrom: Joi.date().optional(),
  availableTill :Joi.date().optional(),
  avgRating:Joi.number().optional(),
  courseCode:Joi.string().optional(),
  courseId:Joi.number().optional(),
  courseType:Joi.string().optional(),
  currency:Joi.string().optional(),
  description:Joi.string().optional(),
  price:Joi.string().valid("totalPrice","discountPrice","basePrice").optional(),
  status: Joi.string().valid("Active","Inactive").optional(),
  thumbnail:Joi.string().optional(),
  updatedBy:Joi.string().required(),
}).options({ abortEarly: false });

export const deleteCourse = Joi.object({
  id: Joi.string().required(),
  deletedBy:Joi.string().required(),
});
