import Joi from 'joi'

export const createInterview=Joi.object({
    candidateId:Joi.string().required(),
    jobId: Joi.string().required(),
    interviewMode:Joi.string().required(),
    candidateName:Joi.string().required(),
    interviewDate:Joi.string().required(),
    interviewTime:Joi.string().required(),
    interviewLink:Joi.string().optional().allow('',null),
    interviewAddress:Joi.string().optional().allow('',null),
    description:Joi.string().optional().allow('',null),
    createdBy:Joi.string().required(),

}).options({ abortEarly: false })

export const updateInterviewStaus=Joi.object({
    id:Joi.string().required(),
    status:Joi.boolean().required(),
})

export const updateInterview=Joi.object({
    id:Joi.string().required(),
    candidateId:Joi.string().optional(),
    jobId: Joi.string().required(),
    candidateName:Joi.string().required(),
    interviewDate:Joi.string().optional(),
    interviewTime:Joi.string().optional(),
    interviewLink:Joi.string().optional(),
    description:Joi.string().optional(),
    updatedBy:Joi.string().required(),
}).options({ abortEarly: false })

export const deleteInterview=Joi.object({
    id:Joi.string().required(),
    deletedBy:Joi.string().required()
})