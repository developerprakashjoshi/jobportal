"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsHire = void 0;
const mongoose_1 = require("mongoose");
var IsHire;
(function (IsHire) {
    IsHire[IsHire["Active"] = 1] = "Active";
    IsHire[IsHire["Inactive"] = 0] = "Inactive";
})(IsHire = exports.IsHire || (exports.IsHire = {}));
const RecruiterSchema = new mongoose_1.Schema({
    firstName: { type: String },
    LastName: { type: String },
    email: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    phoneNumber: { type: Number },
    companyName: { type: String },
    employeeSize: { type: Number },
    selectIndustry: { type: String },
    yourDesignation: { type: String },
    isHiringManager: { type: Number, enum: [0, 1], default: 0 },
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
const Recruiter = (0, mongoose_1.model)('Recruiter', RecruiterSchema);
exports.default = Recruiter;
