import Joi from "joi";

export const createRole = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().required(),
  createdBy:Joi.string().required(),
}).options({ abortEarly: false });

export const updateRole = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().optional(),
  updatedBy:Joi.string().required(),
}).options({ abortEarly: false });

export const deleteRole = Joi.object({
  id: Joi.string().required(),
  deleteBy:Joi.string().required(),
});
