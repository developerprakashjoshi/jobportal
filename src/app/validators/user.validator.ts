import Joi from "joi";

interface Address {
  id: string;
  street: string;
  country: string;
  state: string;
  city: string;
  postalCode: number;
  type: string;
  updatedBy: string;
}

interface Education {
  id: string;
  level: string;
  fieldStudy: string;
  instituteName: string;
  board: string;
  passingYear: number;
  state: string;
  city: string;
  course:string;
  courseType:string;
  courseSpecialization:string;
  certificate:string;
  updatedBy: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  currentlyWorking: boolean;
  fromMonth: string;
  fromYear: string;
  toMonth: string;
  toYear: string;
  description: string;
  updatedBy: string;
}

interface Certificate {
  file: string;
}

export const createAddress = Joi.object<Address>({
  street: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.number().required(),
  type: Joi.string().valid("home", "office").required(),
}).options({ abortEarly: false });

export const createEducation = Joi.object<Education>({
  level: Joi.string().required(),
  fieldStudy: Joi.string().optional(),
  instituteName: Joi.string().required(),
  board: Joi.string().optional(),
  passingYear: Joi.number().required(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  course:Joi.string().optional(),
  courseType:Joi.string().optional(),
  courseSpecialization:Joi.string().optional(),
  certificate:Joi.string().optional(),
}).options({ abortEarly: false });

export const createExperience = Joi.object<Experience>({
  jobTitle: Joi.string().required(),
  companyName: Joi.string().required(),
  currentlyWorking: Joi.boolean().required(),
  fromMonth: Joi.string().required(),
  fromYear: Joi.string().required(),
  toMonth: Joi.string().required(),
  toYear: Joi.string().required(),
  description: Joi.string().required(),
}).options({ abortEarly: false });

export const createCertificate = Joi.object<Certificate>({
  file: Joi.string().required(),
}).options({ abortEarly: false });

interface User {
  id: String;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  termsConditions: boolean;
  curriculumVitae: string;
  phoneNo: number;
  addresses: Address[];
  education: Education[];
  experiences: Experience[];
  skillSets: string;
  recommendationSets: string;
  certificates: Certificate[];
  onboardingStep: number;
  type: String;
  isReady: boolean;
  file:object;
  createdAt: Date;
  createdBy: string;
  createdFrom?: String;

  updatedAt: Date;
  updatedBy: string;
  updateFrom?: String;

  deletedAt: Date;
  deleteBy: string;
  deleteFrom?: String;
}

export const registerUser = Joi.object<User>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  termsConditions: Joi.boolean().valid(true).required(),
  type: Joi.string().valid("student").required(),
}).options({ abortEarly: false });

export const loginUser = Joi.object<User>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

export const updatePassword = Joi.object<User>({
  id: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

export const updateBasicInfo = Joi.object<User>({
  id: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.number().optional(),
  updatedBy: Joi.string().required(),
}).options({ abortEarly: false });

export const updateAddress = Joi.array().items(Joi.object<Address>({
  id: Joi.string().required(),
  street: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.number().required(),
  updatedBy: Joi.string().required(),
  type: Joi.string().valid("home", "office").required(),
})).options({ abortEarly: false });

export const updateEducation = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    level: Joi.string().optional().allow('',null),
    fieldStudy: Joi.string().optional().allow('',null),
    instituteName: Joi.string().required(),
    board: Joi.string().optional().allow('',null),
    passingYear: Joi.number().required(),
    state: Joi.string().optional().allow('',null),
    city: Joi.string().optional().allow('',null),
    course:Joi.string().optional().allow('',null),
    courseType:Joi.string().optional().allow('',null),
    courseSpecialization:Joi.string().optional().allow('',null),
    certificate:Joi.string().optional().allow('',null),
  })
).options({ abortEarly: false });

export const updateExperience = Joi.array().items(
  Joi.object<Experience>({
  id: Joi.string().required(),
  jobTitle: Joi.string().required(),
  companyName: Joi.string().required(),
  currentlyWorking: Joi.boolean().required(),
  fromMonth: Joi.string().required(),
  fromYear: Joi.number().required(),
  toMonth: Joi.when('currentlyWorking', {
    is: false,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  toYear: Joi.when('currentlyWorking', {
    is: false,
    then: Joi.number().required(),
    otherwise: Joi.number().optional(),
  }),
  description: Joi.string().required(),
  updatedBy: Joi.string().required(),
})
).options({ abortEarly: false });

export const updateSkillSets = Joi.object<User>({
  id: Joi.string().required(),
  skillSets: Joi.string().required(),
  recommendationSets: Joi.string().required(),
  updatedBy: Joi.string().required(),
}).options({ abortEarly: false });

export const updateConfirmStatus = Joi.object<User>({
  id: Joi.string().required(),
  updatedAt: Joi.number().required(),
}).options({ abortEarly: false });

export const uploadFile = Joi.object<User>({
  id: Joi.string().required(),
  // file: Joi.object({
  //   // Validate the file's original filename
  //   originalname: Joi.string().required(),
  //   // Validate the file's MIME type (e.g., image/png, application/pdf)
  //   mimetype: Joi.string().required(),
  //   // Validate the file's size (limit to 10MB in this example)
  //   size: Joi.number().max(10 * 1024 * 1024).required(),
  // }).required(),
}).options({ abortEarly: false });

export const createUser = Joi.object<User>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  termsConditions: Joi.boolean().required(),
  curriculumVitae: Joi.string().required(),
  phoneNo: Joi.number().required(),
  addresses: Joi.array().items(createAddress).required(),
  education: Joi.array().items(createEducation).required(),
  experiences: Joi.array().items(createExperience).required(),
  skillSets: Joi.string().required(),
  recommendationSets: Joi.string().required(),
  certificates: Joi.array().items(createCertificate).required(),
  isReady: Joi.boolean().required(),
}).options({ abortEarly: false });
