"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryStatus = void 0;
const mongoose_1 = require("mongoose");
var CountryStatus;
(function (CountryStatus) {
    CountryStatus[CountryStatus["Active"] = 1] = "Active";
    CountryStatus[CountryStatus["Inactive"] = 0] = "Inactive";
})(CountryStatus = exports.CountryStatus || (exports.CountryStatus = {}));
const CountrySchema = new mongoose_1.Schema({
    countryName: { type: String },
    countryCode: { type: String },
    status: { type: Number, enum: [0, 1], default: 1 },
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
const Country = (0, mongoose_1.model)('Country', CountrySchema);
exports.default = Country;
