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
const recruiter_schema_1 = __importDefault(require("@models/recruiter.schema"));
const mongodb_1 = require("mongodb");
class CityService extends service_1.default {
    constructor() {
        super();
        this.recruiteModel = mongoose_1.default.model('Recruiter');
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.recruiteModel.countDocuments({ deleted_at: { $eq: null } });
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
                const record = yield this.recruiteModel.find();
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
                const record = yield this.recruiteModel.findById(pid);
                if (!record) {
                    return new response_1.default(true, 404, "Record not found");
                }
                return new response_1.default(true, 200, "Read operation successful", record);
            }
            catch (error) {
                return new response_1.default(false, 400, error.message);
            }
        });
    }
    retrieveByCountry(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield this.recruiteModel.findOne({ where: { name: name } });
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
                let recruiter = new recruiter_schema_1.default();
                recruiter.firstName = data.firstName;
                recruiter.LastName = data.LastName;
                recruiter.email = data.email;
                recruiter.password = data.password;
                recruiter.confirmPassword = data.confirmPassword;
                recruiter.phoneNumber = data.phoneNumber;
                recruiter.companyName = data.companyName;
                recruiter.employeeSize = data.employeeSize;
                recruiter.selectIndustry = data.selectIndustry;
                recruiter.yourDesignation = data.yourDesignation;
                recruiter.isHiringManager = data.isHiringManager;
                recruiter.createdAt = new Date();
                recruiter.createdBy = data.createdBy;
                recruiter.createdFrom = data.ip;
                const result = yield recruiter.save();
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
                const recruiter = yield this.recruiteModel.findById(pid);
                if (!recruiter) {
                    return new response_1.default(false, 404, "Record not found");
                }
                if (data.firstName) {
                    recruiter.firstName = data.firstName;
                }
                if (data.LastName) {
                    recruiter.LastName = data.LastName;
                }
                if (data.email) {
                    recruiter.email = data.email;
                }
                if (data.password) {
                    recruiter.password = data.password;
                }
                if (data.confirmPassword) {
                    recruiter.confirmPassword = data.confirmPassword;
                }
                if (data.phoneNumber) {
                    recruiter.phoneNumber = data.phoneNumber;
                }
                if (data.companyName) {
                    recruiter.companyName = data.companyName;
                }
                if (data.employeeSize) {
                    recruiter.employeeSize = data.employeeSize;
                }
                if (data.selectIndustry) {
                    recruiter.selectIndustry = data.selectIndustry;
                }
                if (data.yourDesignation) {
                    recruiter.yourDesignation = data.yourDesignation;
                }
                if (data.isHiringManager) {
                    recruiter.isHiringManager = data.isHiringManager;
                }
                recruiter.updatedAt = new Date();
                recruiter.updatedBy = data.updatedBy;
                recruiter.updatedFrom = data.ip;
                const result = yield recruiter.save();
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
                const city = yield this.recruiteModel.findById(pid);
                if (!city) {
                    return new response_1.default(true, 404, "City not found", city);
                }
                city.deletedAt = (0, moment_1.default)().toDate(); // Set the deleted_at field to the current timestamp
                city.deleteBy = data.delete_by;
                city.deleteFrom = data.ip;
                const result = yield city.save(city);
                return new response_1.default(true, 200, "Delete operation successful", city);
            }
            catch (error) {
                return new response_1.default(false, 400, error.city);
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
                            { firstName: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
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
                    this.recruiteModel.find()
                        .select({
                        "firstName": 1,
                        "LastName": 1,
                        "email": 1,
                        "_id": 0
                    })
                        .where(searchQuery)
                        .sort(sortQuery)
                        .skip(skip)
                        .limit(limit),
                    this.recruiteModel.countDocuments(searchQuery),
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
exports.default = CityService;
