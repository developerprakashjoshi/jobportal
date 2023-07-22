"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteState = exports.updateState = exports.createState = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createState = joi_1.default.object({
    stateName: joi_1.default.string().required(),
    stateCode: joi_1.default.string().required(),
    countryName: joi_1.default.string().required(),
    countryId: joi_1.default.string().required(),
    status: joi_1.default.number().valid(0, 1).required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateState = joi_1.default.object({
    id: joi_1.default.string().required(),
    stateName: joi_1.default.string().optional(),
    stateCode: joi_1.default.string().optional(),
    countryName: joi_1.default.string().optional(),
    status: joi_1.default.number().valid(0, 1).optional(),
    updatedBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.deleteState = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required()
});
