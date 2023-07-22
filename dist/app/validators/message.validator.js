"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessages = exports.createMessage = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createMessage = joi_1.default.object({
    message: joi_1.default.string().required(),
    senderId: joi_1.default.string().required(),
    recipientId: joi_1.default.string().required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateMessages = joi_1.default.object({
    id: joi_1.default.string().required(),
    updatedBy: joi_1.default.string().required(),
    senderId: joi_1.default.string().optional(),
    recipientId: joi_1.default.string().optional(),
    message: joi_1.default.string().optional(),
}).options({ abortEarly: false });
exports.deleteMessage = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required()
});
