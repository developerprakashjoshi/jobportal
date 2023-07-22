"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCity = exports.updateCity = exports.createCity = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCity = joi_1.default.object({
    cityName: joi_1.default.string().required(),
    cityCode: joi_1.default.string().required(),
    stateName: joi_1.default.string().required(),
    countryName: joi_1.default.string().required(),
    stateId: joi_1.default.string().required(),
    status: joi_1.default.number().valid(0, 1).required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateCity = joi_1.default.object({
    id: joi_1.default.string().required(),
    updatedBy: joi_1.default.string().required(),
    cityName: joi_1.default.string().optional(),
    cityCode: joi_1.default.string().optional(),
    stateId: joi_1.default.string().optional(),
    stateName: joi_1.default.string().required(),
    countryName: joi_1.default.string().required(),
    status: joi_1.default.number().valid(0, 1).optional()
}).options({ abortEarly: false });
exports.deleteCity = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required()
});
