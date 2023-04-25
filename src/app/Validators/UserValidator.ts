import Joi from 'joi'

export const createUser=Joi.object({
    'first_name':Joi.string().required(),
    'last_name':Joi.string().required(),
    'mobile_phone_prefix':Joi.string().required(),
    'mobile_no':Joi.number().required(),
    'birth':Joi.date().required(),
    'gender':Joi.string().valid('M', 'F', 'O').required(),
    'password':Joi.string().required(),
}).options({ abortEarly: false })

export const updateUser=Joi.object({
    'id':Joi.number().required(),
    'first_name':Joi.string().required(),
    'last_name':Joi.string().required(),
    'mobile_phone_prefix':Joi.string().required(),
    'mobile_no':Joi.number().required(),
    'birth':Joi.date().required(),
    'gender':Joi.string().valid('M', 'F', 'O').required(),
    'password':Joi.string().required(),
}).options({ abortEarly: false })

export const deleteUser=Joi.object({
    'id':Joi.number().required()
})