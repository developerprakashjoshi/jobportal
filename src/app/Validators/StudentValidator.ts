import Joi from 'joi'

export const studentSchema=Joi.object({
    'lastName':Joi.string().required(),
    'age':Joi.string().required(),
    'type':Joi.number().required(),
    "profile":Joi.object().required()
})