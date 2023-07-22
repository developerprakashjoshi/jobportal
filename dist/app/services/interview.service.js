"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("@config/mongoose"));
const service_1 = __importDefault(require("@libs/service"));
const moment_1 = __importDefault(require("moment"));
const response_1 = __importDefault(require("@libs/response"));
const interview_schema_1 = __importDefault(require("@models/interview.schema"));
const mongodb_1 = require("mongodb");
class InterviewService extends service_1.default {
    constructor() {
        super();
        this.interviewModel = mongoose_1.default.model('Interview');
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.interviewModel.countDocuments();
                return new response_1.default(true, 200, "Count operation successful", result);
            }
            catch (error) {
                return new response_1.default(false, 400, error.message);
            }
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield this.interviewModel.find();
                return new response_1.default(true, 200, "Read operation successful", record);
            }
            catch (error) {
                return new response_1.default(false, 400, error.message);
            }
        });
    }
    retrieve(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValidObjectId = mongodb_1.ObjectId.isValid(pid);
                if (!isValidObjectId) {
                    return new response_1.default(false, 400, "Invalid ObjectId", undefined);
                }
                let id = new mongodb_1.ObjectId(pid);
                const record = yield this.interviewModel.findById(pid);
                if (!record) {
                    return new response_1.default(false, 404, "Record not found");
                }
                return new response_1.default(true, 200, "Read operation successful", record);
            }
            catch (error) {
                return new response_1.default(false, 400, error.message);
            }
        });
    }
    retrieveByinterview(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield this.interviewModel.findOne({ where: { name: name } });
                return records;
            }
            catch (error) {
                return error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let interview = new interview_schema_1.default();
                interview.candidateName = data.candidateName;
                interview.interviewDate = data.interviewDate;
                interview.interviewTime = data.interviewTime;
                interview.interviewLink = data.interviewLink;
                interview.description = data.description;
                interview.createdAt = new Date();
                interview.createdBy = data.createdBy;
                interview.createdFrom = data.ip;
                const result = yield interview.save();
                return new response_1.default(true, 201, "Insert operation successful", result);
            }
            catch (error) {
                return new response_1.default(false, 400, error.message);
            }
        });
    }
    update(pid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValidObjectId = mongodb_1.ObjectId.isValid(pid);
                if (!isValidObjectId) {
                    return new response_1.default(false, 400, "Invalid ObjectId", undefined);
                }
                let id = new mongodb_1.ObjectId(pid);
                const interview = yield this.interviewModel.findById(pid);
                if (!interview) {
                    return new response_1.default(true, 404, "Record not found");
                }
                if (data.candidateName) {
                    interview.candidateName = data.candidateName;
                }
                if (data.interviewDate) {
                    interview.interviewDate = data.interviewDate;
                }
                if (data.interviewTime) {
                    interview.interviewTime = data.interviewTime;
                }
                if (data.interviewLink) {
                    interview.interviewLink = data.interviewLink;
                }
                if (data.description) {
                    interview.description = data.description;
                }
                interview.updatedAt = new Date();
                interview.updatedBy = data.updatedBy;
                interview.updatedFrom = data.ip;
                const result = yield interview.save();
                return new response_1.default(true, 200, "Update operation successful", result);
            }
            catch (error) {
                return new response_1.default(false, 400, error.message);
            }
        });
    }
    delete(pid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValidObjectId = mongodb_1.ObjectId.isValid(pid);
                if (!isValidObjectId) {
                    return new response_1.default(false, 400, "Invalid ObjectId", undefined);
                }
                let id = new mongodb_1.ObjectId(pid);
                const interview = yield this.interviewModel.findById(pid);
                if (!interview) {
                    return new response_1.default(true, 404, "Interview not found", interview);
                }
                interview.deletedAt = (0, moment_1.default)().toDate(); // Set the deleted_at field to the current timestamp
                interview.deleteBy = data.deleteBy;
                interview.deleteFrom = data.ip;
                yield interview.save(interview);
                return new response_1.default(true, 200, "Delete operation successful", interview);
            }
            catch (error) {
                return new response_1.default(false, 400, error.message);
            }
        });
    }
    datatable(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, search, sort } = data;
                let errorMessage = '';
                if (page !== undefined && limit !== undefined) {
                    if (isNaN(page) || !Number.isInteger(Number(page)) || isNaN(limit) || !Number.isInteger(Number(limit))) {
                        errorMessage = "Both 'page' and 'limit' must be integers.";
                    }
                }
                else if (page !== undefined) {
                    if (isNaN(page) || !Number.isInteger(Number(page))) {
                        errorMessage = "'page' must be an integer.";
                    }
                }
                else if (limit !== undefined) {
                    if (isNaN(limit) || !Number.isInteger(Number(limit))) {
                        errorMessage = "'limit' must be an integer.";
                    }
                }
                if (errorMessage) {
                    return new response_1.default(false, 400, errorMessage);
                }
                let searchQuery = {};
                if (search !== undefined) {
                    searchQuery = {
                        $or: [
                            { candidateName: { $regex: search, $options: 'i' } },
                            { interviewDate: { $regex: search, $options: 'i' } },
                        ],
                    };
                }
                let sortQuery = {};
                if (sort !== undefined) {
                    const sortParams = sort.split(':');
                    if (sortParams.length === 2) {
                        const [column, order] = sortParams;
                        sortQuery = { [column]: order === 'desc' ? -1 : 1 };
                    }
                }
                page = page === undefined ? 1 : parseInt(page);
                limit = limit === undefined ? 10 : parseInt(limit);
                const skip = (page - 1) * limit;
                const [records, totalCount] = yield Promise.all([
                    this.interviewModel.find()
                        .select({
                        "candidateName": 1,
                        "interviewDate": 1,
                        "interviewTime": 1,
                        "interviewLink": 1,
                        "description": 1,
                        "_id": 0
                    })
                        .where(searchQuery)
                        .sort(sortQuery)
                        .skip(skip)
                        .limit(limit),
                    this.interviewModel.countDocuments(searchQuery),
                ]);
                if (records.length === 0) {
                    return new response_1.default(true, 200, 'No records available', {});
                }
                const totalPages = Math.ceil(totalCount / limit);
                const currentPage = page;
                const output = {
                    records: records,
                    totalPages: totalPages !== null ? totalPages : 0,
                    currentPage: currentPage !== null ? currentPage : 0,
                    filterCount: records.length,
                    totalCount: totalCount,
                };
                return new response_1.default(true, 200, 'Read operation successful', output);
            }
            catch (error) {
                return new response_1.default(false, 500, 'Internal Server Error', undefined, undefined, error.message);
            }
        });
    }
}
exports.default = InterviewService;
