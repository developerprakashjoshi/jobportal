import Joi from 'joi'

export const createCountry=Joi.object({
    countryName:Joi.string().required(),
    countryCode:Joi.string().required(),
    status:Joi.string().valid("Active","Inactive").required(),
    createdBy:Joi.string().required(),
}).options({ abortEarly: false })

export const updateCountry=Joi.object({
    id:Joi.string().required(),
    countryName:Joi.string().optional(),
    countryCode:Joi.string().optional(),
    status:Joi.string().valid("Active","Inactive").optional(),
    updatedBy:Joi.string().required(),
}).options({ abortEarly: false })

export const deleteCountry=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required(),
})