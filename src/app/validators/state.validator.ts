import Joi from 'joi'

export const createState=Joi.object({
    stateName:Joi.string().required(),
    stateCode:Joi.string().required(),
    countryName:Joi.string().required(),
    countryId:Joi.string().required(),
    status:Joi.string().valid("Active","Inactive").required(),
    createdBy:Joi.string().required(),
}).options({ abortEarly: false })

export const updateState=Joi.object({
    id:Joi.string().required(),
    stateName:Joi.string().optional(),
    stateCode:Joi.string().optional(),
    countryName:Joi.string().optional(),
    status:Joi.string().valid("Active","Inactive").optional(),
    updatedBy:Joi.string().required(),
}).options({ abortEarly: false })

export const deleteState=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})