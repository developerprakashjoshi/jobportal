"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCountry = exports.updateCountry = exports.createCountry = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCountry = joi_1.default.object({
    countryName: joi_1.default.string().required(),
    countryCode: joi_1.default.string().required(),
    status: joi_1.default.number().valid(0, 1).required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateCountry = joi_1.default.object({
    id: joi_1.default.string().required(),
    countryName: joi_1.default.string().optional(),
    countryCode: joi_1.default.string().optional(),
    status: joi_1.default.number().optional(),
    updatedBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.deleteCountry = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required(),
});
