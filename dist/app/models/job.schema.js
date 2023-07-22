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
exports.JobStatus = exports.IsStartPlanned = exports.EducationLevel = exports.ReportWork = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ReportWork;
(function (ReportWork) {
    ReportWork[ReportWork["specificAddress"] = 1] = "specificAddress";
    ReportWork[ReportWork["notSpecificAddress"] = 0] = "notSpecificAddress";
})(ReportWork = exports.ReportWork || (exports.ReportWork = {}));
var EducationLevel;
(function (EducationLevel) {
    EducationLevel[EducationLevel["Ten"] = 1] = "Ten";
    EducationLevel[EducationLevel["twelve"] = 2] = "twelve";
    EducationLevel[EducationLevel["Diploma"] = 3] = "Diploma";
    EducationLevel[EducationLevel["Bachelor"] = 4] = "Bachelor";
    EducationLevel[EducationLevel["Master"] = 5] = "Master";
})(EducationLevel = exports.EducationLevel || (exports.EducationLevel = {}));
var IsStartPlanned;
(function (IsStartPlanned) {
    IsStartPlanned[IsStartPlanned["Yes"] = 1] = "Yes";
    IsStartPlanned[IsStartPlanned["No"] = 0] = "No";
})(IsStartPlanned = exports.IsStartPlanned || (exports.IsStartPlanned = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus[JobStatus["Active"] = 1] = "Active";
    JobStatus[JobStatus["Inactive"] = 0] = "Inactive";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));
const JobSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Recruiter', // Referencing the User model
    },
    company: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
    },
    title: { type: String },
    reportToWork: { type: Number, enum: [0, 1], default: 1 },
    reportAddress: { type: String },
    jobType: { type: String },
    schedule: { type: String },
    isStartPlanned: { type: Number, enum: [0, 1], default: 1 },
    startDate: { type: Date },
    payRange: { type: String },
    min: { type: String },
    max: { type: String },
    perMonth: { type: String },
    supplementalPay: { type: String },
    benefitsOffer: { type: String },
    description: { type: String },
    isCVRequired: { type: Boolean },
    isDeadlineApplicable: { type: Boolean },
    deadlineDate: { type: Date },
    noOfHiring: { type: Number },
    hiringSlot: { type: String },
    aboutCompany: { type: String },
    educationLevel: { type: Number, enum: [1, 2, 3, 4], default: 4 },
    yearOfExperience: { type: Number },
    status: { type: Number, enum: [0, 1], default: 0 },
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
const Jobs = (0, mongoose_1.model)('Jobs', JobSchema);
exports.default = Jobs;
