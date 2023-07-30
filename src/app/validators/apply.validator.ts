import Joi from "joi";

export const createApply = Joi.object({
  jobId: Joi.string().required(),
  userId: Joi.string().required(),
  createdBy:Joi.string().required(),
  
}).options({ abortEarly: false });

export const updateApply = Joi.object({
  id: Joi.string().required(),
  updatedBy:Joi.string().required(),
  jobId: Joi.string().optional(),
  userId: Joi.string().optional(),
}).options({ abortEarly: false });

export const updateCandidateStatus = Joi.object({
  id: Joi.string().required(),
  status:Joi.boolean().required()
})

export const deleteApply = Joi.object({
  id: Joi.string().required(),
  deleteBy:Joi.string().required()
});
