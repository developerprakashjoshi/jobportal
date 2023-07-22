"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApply = exports.updateApply = exports.createApply = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createApply = joi_1.default.object({
    jobId: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateApply = joi_1.default.object({
    id: joi_1.default.string().required(),
    updatedBy: joi_1.default.string().required(),
    jobId: joi_1.default.string().optional(),
    userId: joi_1.default.string().optional(),
}).options({ abortEarly: false });
exports.deleteApply = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required()
});
