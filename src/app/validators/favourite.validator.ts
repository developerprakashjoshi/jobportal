import Joi from "joi";

export const createFavourite = Joi.object({
  userId: Joi.string().required(),
  jobId: Joi.string().required(),
  createdBy:Joi.string().required(),
}).options({ abortEarly: false });

export const updateFavourite = Joi.object({
  id:Joi.string().required(),
  userId: Joi.string().required(),
  jobId: Joi.string().required(),
  updatedBy:Joi.string().required(),
}).options({ abortEarly: false });

export const deleteFavourite = Joi.object({
  userId: Joi.string().required(),
  jobId: Joi.string().required(),
  deletedBy:Joi.string().required()
});
