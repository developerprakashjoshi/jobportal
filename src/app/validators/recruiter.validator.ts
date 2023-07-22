import Joi from 'joi'

export const createRecruiter=Joi.object({
    firstName:Joi.string().required(),
    LastName:Joi.string().required(),
    email:Joi.string().required(),
    password:Joi.string().required(),
    confirmPassword:Joi.string().required(),
    phoneNumber:Joi.number().required(),
    companyName:Joi.string().required(),
    employeeSize:Joi.number().required(),
    selectIndustry:Joi.string().required(),
    yourDesignation:Joi.string().required(),
    isHiringManager:Joi.number().required(),
    createdBy:Joi.string().required(),
}).options({ abortEarly: false })

export const updateRecruiter=Joi.object({
    id:Joi.string().required(),
    updated_by:Joi.string().required(),
    firstName:Joi.string().optional(),
    LastName:Joi.string().optional(),
    email:Joi.string().optional(),
    password:Joi.string().optional(),
    confirmPassword:Joi.string().optional(),
    phoneNumber:Joi.number().optional(),
    companyName:Joi.string().optional(),
    employeeSize:Joi.number().optional(),
    selectIndustry:Joi.string().optional(),
    yourDesignation:Joi.string().optional(),
    isHiringManager:Joi.number().optional(),
}).options({ abortEarly: false })

export const deleteRecruiter=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})