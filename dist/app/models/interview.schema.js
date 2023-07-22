"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InterviewSchema = new mongoose_1.Schema({
    user_id: { type: Number },
    candidateName: { type: String },
    interviewDate: { type: Date },
    interviewTime: { type: Date },
    interviewLink: { type: String },
    description: { type: String },
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
const Interview = (0, mongoose_1.model)('Interview', InterviewSchema);
exports.default = Interview;
