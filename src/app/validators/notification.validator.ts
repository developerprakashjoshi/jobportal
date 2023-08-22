import Joi from 'joi'

export const createNotification=Joi.object({
    content:Joi.string().required(),
    type:Joi.string().required(),
    senderId:Joi.string().required(),
    recipientId:Joi.string().required(),
    commonUser:Joi.string().required(),
    createdBy:Joi.string().required(),

}).options({ abortEarly: false })

export const updateNotification=Joi.object({
    id:Joi.string().required(),
    type:Joi.string().required(),
    content:Joi.string().optional(),
    senderId:Joi.string().optional(),
    recipientId:Joi.string().optional(),
    commonUser:Joi.string().required(),
    updatedBy:Joi.string().required(),
    
}).options({ abortEarly: false })

export const deleteNotification=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})