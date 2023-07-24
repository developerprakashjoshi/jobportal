import Joi from 'joi'

export const createCity=Joi.object({
    cityName:Joi.string().required(),
    cityCode:Joi.string().required(),
    stateName:Joi.string().required(),
    countryName:Joi.string().required(),
    stateId:Joi.string().required(),
    status:Joi.string().valid(0,1).required(),
    createdBy:Joi.string().required(),
}).options({ abortEarly: false })

export const updateCity=Joi.object({
    id:Joi.string().required(),
    updatedBy:Joi.string().required(),
    cityName:Joi.string().optional(),
    cityCode:Joi.string().optional(),
    stateId:Joi.string().optional(),
    stateName:Joi.string().required(),
    countryName:Joi.string().required(),
    status:Joi.string().valid(0,1).optional()
}).options({ abortEarly: false })

export const deleteCity=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})