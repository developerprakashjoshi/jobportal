import Joi from 'joi'

export const createNotification=Joi.object({
    text:Joi.string().required(),
    senderId:Joi.string().required(),
    recipientId:Joi.string().required(),
    createdBy:Joi.string().required(),

}).options({ abortEarly: false })

export const updateNotification=Joi.object({
    id:Joi.string().required(),
    text:Joi.string().optional(),
    senderId:Joi.string().optional(),
    recipientId:Joi.string().optional(),
    updatedBy:Joi.string().required(),
    
}).options({ abortEarly: false })

export const deleteNotification=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})