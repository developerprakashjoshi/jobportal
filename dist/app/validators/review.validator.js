"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createReview = joi_1.default.object({
    name: joi_1.default.string().required(),
    designation: joi_1.default.string().required(),
    rating: joi_1.default.string().required(),
    message: joi_1.default.string().required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateReview = joi_1.default.object({
    id: joi_1.default.string().required(),
    updatedBy: joi_1.default.string().required(),
    name: joi_1.default.string().optional(),
    designation: joi_1.default.string().optional(),
    rating: joi_1.default.string().optional(),
    message: joi_1.default.string().optional(),
}).options({ abortEarly: false });
exports.deleteReview = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required()
});
