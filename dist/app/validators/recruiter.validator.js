"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecruiter = exports.updateRecruiter = exports.createRecruiter = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRecruiter = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    LastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    confirmPassword: joi_1.default.string().required(),
    phoneNumber: joi_1.default.number().required(),
    companyName: joi_1.default.string().required(),
    employeeSize: joi_1.default.number().required(),
    selectIndustry: joi_1.default.string().required(),
    yourDesignation: joi_1.default.string().required(),
    isHiringManager: joi_1.default.number().required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateRecruiter = joi_1.default.object({
    id: joi_1.default.string().required(),
    updated_by: joi_1.default.string().required(),
    firstName: joi_1.default.string().optional(),
    LastName: joi_1.default.string().optional(),
    email: joi_1.default.string().optional(),
    password: joi_1.default.string().optional(),
    confirmPassword: joi_1.default.string().optional(),
    phoneNumber: joi_1.default.number().optional(),
    companyName: joi_1.default.string().optional(),
    employeeSize: joi_1.default.number().optional(),
    selectIndustry: joi_1.default.string().optional(),
    yourDesignation: joi_1.default.string().optional(),
    isHiringManager: joi_1.default.number().optional(),
}).options({ abortEarly: false });
exports.deleteRecruiter = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required()
});
