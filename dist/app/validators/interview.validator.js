"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInterview = exports.updateInterview = exports.createInterview = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createInterview = joi_1.default.object({
    candidateName: joi_1.default.string().required(),
    interviewDate: joi_1.default.string().required(),
    interviewTime: joi_1.default.string().required(),
    interviewLink: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateInterview = joi_1.default.object({
    id: joi_1.default.string().required(),
    candidateName: joi_1.default.string().required(),
    interviewDate: joi_1.default.string().optional(),
    interviewTime: joi_1.default.string().optional(),
    interviewLink: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    updatedBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.deleteInterview = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required()
});
