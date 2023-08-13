import Joi from 'joi'

export const createJob=Joi.object({
    userId:Joi.string().required(),
    companyId:Joi.string().required(),
    title:Joi.string().required(),
    reportToWork:Joi.number().required(),
    reportAddress: Joi.string().when('reportToWork', {
        is: 1,
        then: Joi.string().required(),
        otherwise: Joi.string().optional().allow(null) // or .strip() to remove the field
    }),
    jobType:Joi.string().required(),
    schedule:Joi.string().required(),
    isStartPlanned:Joi.number().required(),
    startDate: Joi.date().when('isStartPlanned', {
        is: 1,
        then: Joi.date().required(),
        otherwise: Joi.date().optional().allow(null)
    }),
    payRange:Joi.string().required(),
    min:Joi.string().required(),
    max:Joi.string().required(),
    perMonth:Joi.string().required(),
    supplementalPay:Joi.string().required(),
    benefitsOffer:Joi.string().required(),
    description:Joi.string().required(),
    isCVRequired:Joi.boolean().required(),
    isDeadlineApplicable:Joi.boolean().required(),
    deadlineDate: Joi.date().when('isDeadlineApplicable', {
        is: true,
        then: Joi.date().required(),
        otherwise: Joi.date().optional().allow(null)
    }),
    noOfHiring:Joi.number().required(),
    hiringSlot:Joi.string().required(),
    aboutCompany:Joi.string().required(),
    educationLevel:Joi.string().required(),
    yearOfExperience:Joi.number().required(),
    createdBy:Joi.string().required(),
    status:Joi.string().valid("Active","Inactive").required(),


}).options({ abortEarly: false })
export const updateApproveStatus=Joi.object({
    id:Joi.string().required(),
    approveAdmin:Joi.boolean().required()
})
export const jobUpdateStatus=Joi.object({
    id:Joi.string().required(),
    status:Joi.string().valid("Active","Inactive").required(),
})
export const updateJob=Joi.object({
    id:Joi.string().required(),
    userId:Joi.string().required(),
    companyId:Joi.string().required(),
    title:Joi.string().required(),
    reportToWork:Joi.number().optional(),
    reportAddress:Joi.string().optional(),
    jobType:Joi.string().optional(),
    schedule:Joi.string().optional(),
    isStartPlanned:Joi.number().optional(),
    startDate:Joi.date().optional(),
    payRange:Joi.string().optional(),
    min:Joi.string().optional(),
    max:Joi.string().optional(),
    perMonth:Joi.string().optional(),
    supplementalPay:Joi.string().optional(),
    benefitsOffer:Joi.string().optional(),
    description:Joi.string().optional(),
    isCVRequired:Joi.boolean().optional(),
    isDeadlineApplicable:Joi.boolean().optional(),
    deadlineDate:Joi.date().optional(),
    noOfHiring:Joi.number().optional(),
    hiringSlot:Joi.string().optional(),
    aboutCompany:Joi.string().optional(),
    educationLevel:Joi.string().optional(),
    yearOfExperience:Joi.number().optional(),
    updatedBy:Joi.string().required(),
    status:Joi.string().valid("Active","Inactive").optional(),
}).options({ abortEarly: false })

export const deleteJob=Joi.object({
    id:Joi.string().required(),
    deleteBy:Joi.string().required()
})