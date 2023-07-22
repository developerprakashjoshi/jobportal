import Joi from 'joi'

export const createMessage=Joi.object({
    message:Joi.string().required(),
    senderId:Joi.string().required(),
    recipientId:Joi.string().required(),
    createdBy:Joi.string().required(),
}).options({ abortEarly: false })

export const updateMessages=Joi.object({
    id:Joi.string().required(),
    updatedBy:Joi.string().required(),
    senderId:Joi.string().optional(),
    recipientId:Joi.string().optional(),
    message:Joi.string().optional(),
}).options({ abortEarly: false })

export const deleteMessage=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})