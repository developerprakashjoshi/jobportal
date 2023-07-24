import Joi from 'joi'

export const createInterview=Joi.object({
    candidateId:Joi.string().required(),
    candidateName:Joi.string().required(),
    interviewDate:Joi.string().required(),
    interviewTime:Joi.string().required(),
    interviewLink:Joi.string().required(),
    description:Joi.string().required(),
    createdBy:Joi.string().required(),

}).options({ abortEarly: false })

export const updateInterview=Joi.object({
    id:Joi.string().required(),
    candidateId:Joi.string().optional(),
    candidateName:Joi.string().required(),
    interviewDate:Joi.string().optional(),
    interviewTime:Joi.string().optional(),
    interviewLink:Joi.string().optional(),
    description:Joi.string().optional(),
    updatedBy:Joi.string().required(),
}).options({ abortEarly: false })

export const deleteInterview=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})