import express  from "express";

import CompanyController from '@controllers/company.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import multer from 'multer';

const storage = multer.memoryStorage();
import {createCompany,updateCompany,deleteCompany} from "@validators/company.validator"
const route=express.Router();
const upload = multer({ storage });

route.get('/datatable',passportJwt,CompanyController.datatable)
route.get('/count',passportJwt,CompanyController.count)
route.get('/',passportJwt,CompanyController.getCompanies)
route.get('/:id',passportJwt,CompanyController.getCompany)
route.post('/',passportJwt,validator(createCompany),CompanyController.createCompany)
route.patch('/ceo-avtar/:id',passportJwt,upload.single('file'),CompanyController.uploadCeoAvtar)
route.patch('/logo/:id',passportJwt,upload.single('file'),CompanyController.uploadCompanyLogo)
route.patch('/photo/:id',passportJwt,upload.single('file'),CompanyController.uploadPhoto)
route.patch('/:id',passportJwt,validator(updateCompany),CompanyController.updateCompany)
route.delete('/:id',passportJwt,validator(deleteCompany),CompanyController.deleteCompany)
export default route;

