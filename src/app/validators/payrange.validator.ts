import Joi from "joi";

export const createPayRange = Joi.object({
  range: Joi.string().required(),
  createdBy:Joi.string().required(),
}).options({ abortEarly: false });

export const updatePayRange = Joi.object({
  id: Joi.string().required(),
  range: Joi.string().required(),
  updatedBy:Joi.string().required(),
}).options({ abortEarly: false });

export const deletePayRange = Joi.object({
  id: Joi.string().required(),
  deleteBy:Joi.string().required()
});
