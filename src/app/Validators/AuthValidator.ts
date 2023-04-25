import Joi from 'joi'

export const login=Joi.object({
    'mobile_prefix':Joi.string().required(),
    'mobile_phone':Joi.string().required(),
    'password':Joi.string().required(),
}).options({ abortEarly: false })

export const sendOtp=Joi.object({
    'mobile_phone':Joi.string().required(),
})
export const verifyOtp=Joi.object({
    'code':Joi.string().required(),
    'session_key':Joi.string().required(),
})