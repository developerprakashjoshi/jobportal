"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    name: { type: String },
    designation: { type: String },
    rating: { type: String },
    message: { type: String },
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
const Review = (0, mongoose_1.model)('Review', ReviewSchema);
exports.default = Review;
