"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.updateNotification = exports.createNotification = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createNotification = joi_1.default.object({
    text: joi_1.default.string().required(),
    senderId: joi_1.default.string().required(),
    recipientId: joi_1.default.string().required(),
    createdBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.updateNotification = joi_1.default.object({
    id: joi_1.default.string().required(),
    text: joi_1.default.string().optional(),
    senderId: joi_1.default.string().optional(),
    recipientId: joi_1.default.string().optional(),
    updatedBy: joi_1.default.string().required(),
}).options({ abortEarly: false });
exports.deleteNotification = joi_1.default.object({
    id: joi_1.default.string().required(),
    deleteBy: joi_1.default.string().required()
});
