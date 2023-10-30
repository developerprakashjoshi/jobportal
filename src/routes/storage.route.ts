import express  from "express";
import StorageController from '@controllers/storage.controller';
import validator from "@middlewares/validator.middleware";
import passportJwt from "@middlewares/passport-jwt.middleware";
import {createRole,updateRole,deleteRole} from "@validators/role.validator"

import multer from 'multer';
const route=express.Router();
// Define file upload storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

route.get('/datatable',passportJwt,StorageController.datatable)
route.get('/count',passportJwt,StorageController.count)
route.get('/',passportJwt,StorageController.getStorages)
route.get('/:id',passportJwt,StorageController.getStorage)
route.get('/:fileName',passportJwt,StorageController.getStorageByFilename)
route.post('/',passportJwt,upload.single('file'),StorageController.upload)
route.patch('/:id',passportJwt,upload.single('file'),StorageController.update)
route.delete('/:id',passportJwt,StorageController.delete)
export default route;

