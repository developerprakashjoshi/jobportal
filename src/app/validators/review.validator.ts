import Joi from 'joi'

export const createReview=Joi.object({
    name:Joi.string().required(),
    designation:Joi.string().required(),
    rating:Joi.string().required(),
    message:Joi.string().required(),
    createdBy:Joi.string().required(),
}).options({ abortEarly: false })

export const updateReview=Joi.object({
    id:Joi.string().required(),
    updatedBy:Joi.string().required(),
    name:Joi.string().optional(),
    designation:Joi.string().optional(),
    rating:Joi.string().optional(),
    message:Joi.string().optional(),
}).options({ abortEarly: false })

export const deleteReview=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})