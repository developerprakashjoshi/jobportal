import Joi from "joi";

export const createSearch = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().required(),
  keywords: Joi.string().required(),
  status: Joi.number().required(),
}).options({ abortEarly: false });

export const updateSearch = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.number().optional(),
}).options({ abortEarly: false });

export const deleteSearch = Joi.object({
  id: Joi.string().required(),
});
