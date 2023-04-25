import Joi from 'joi'

export const createRole=Joi.object({
    'name':Joi.string().required(),
    'description':Joi.string().required(),
    'status':Joi.number().required(),
}).options({ abortEarly: false })

export const updateRole=Joi.object({
    'id':Joi.number().required(),
    'name':Joi.string().required(),
    'description':Joi.string().required(),
    'status':Joi.number().required(),
}).options({ abortEarly: false })

export const deleteRole=Joi.object({
    'id':Joi.number().required()
})