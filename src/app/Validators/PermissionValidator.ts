import Joi from 'joi'

export const createPermission=Joi.object({
    'name':Joi.string().required(),
    'description':Joi.string().required(),
    'status':Joi.number().required(),
}).options({ abortEarly: false })

export const updatePermission=Joi.object({
    'id':Joi.number().required(),
    'name':Joi.string().required(),
    'description':Joi.string().required(),
    'status':Joi.number().required(),
}).options({ abortEarly: false })

export const deletePermission=Joi.object({
    'id':Joi.number().required()
})