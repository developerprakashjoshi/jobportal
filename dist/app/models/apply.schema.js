"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ApplyStatus;
(function (ApplyStatus) {
    ApplyStatus[ApplyStatus["Active"] = 1] = "Active";
    ApplyStatus[ApplyStatus["Inactive"] = 0] = "Inactive";
})(ApplyStatus = exports.ApplyStatus || (exports.ApplyStatus = {}));
const ApplySchema = new mongoose_1.Schema({
    job: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Job', // Referencing the User model
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    applyAt: { type: Date },
    created_at: { type: String },
    createdAt: { type: Date },
    createdBy: { type: String },
    createdFrom: { type: String },
    updatedAt: { type: Date },
    updatedBy: { type: String },
    updateFrom: { type: String },
    deletedAt: { type: Date },
    deleteBy: { type: String },
    deleteFrom: { type: String },
});
const Apply = (0, mongoose_1.model)('Apply', ApplySchema);
exports.default = Apply;
