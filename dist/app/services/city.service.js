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
const city_schema_1 = __importDefault(require("@models/city.schema"));
const mongodb_1 = require("mongodb");
class CityService extends service_1.default {
    constructor() {
        super();
        this.cityModel = mongoose_1.default.model('City');
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.cityModel.countDocuments({ deleted_at: { $eq: null } });
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
                const record = yield this.cityModel.find();
                delete record.updated_by;
                delete record.updated_from;
                delete record.updated_at;
                delete record.delete_by;
                delete record.delete_from;
                delete record.deleted_at;
                delete record.created_by;
                delete record.created_from;
                delete record.created_at;
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
                const record = yield this.cityModel.findById(pid).populate('state');
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
    retrieveByCountry(cityName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield this.cityModel.find({ cityName: cityName });
                return new response_1.default(true, 200, "Read operation successful", record);
            }
            catch (error) {
                return new response_1.default(false, 400, error.message);
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let city = new city_schema_1.default();
                city.cityName = data.cityName;
                city.cityCode = data.cityCode;
                city.stateName = data.stateName;
                city.countryName = data.countryName;
                city.state = data.stateId;
                city.status = data.status;
                city.createdAt = new Date();
                city.createdBy = data.createdBy;
                city.createdFrom = data.ip;
                const result = yield city.save();
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
                const city = yield this.cityModel.findById(pid);
                if (!city) {
                    return new response_1.default(false, 404, "Record not found");
                }
                if (data.cityName) {
                    city.cityName = data.cityName;
                }
                if (data.cityCode) {
                    city.cityCode = data.cityCode;
                }
                if (data.stateName) {
                    city.stateName = data.stateName;
                }
                if (data.countryName) {
                    city.countryName = data.countryName;
                }
                if (data.status) {
                    city.status = data.status;
                }
                if (data.stateId) {
                    city.state = data.stateId;
                }
                city.updatedAt = new Date();
                city.updatedBy = data.updatedBy;
                city.updatedFrom = data.ip;
                const result = yield city.save();
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
                const city = yield this.cityModel.findById(pid);
                if (!city) {
                    return new response_1.default(true, 404, "City not found", city);
                }
                city.deletedAt = (0, moment_1.default)().toDate(); // Set the deleted_at field to the current timestamp
                city.deleteBy = data.deleteBy;
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
                            { cityName: { $regex: search, $options: 'i' } },
                            { stateName: { $regex: search, $options: 'i' } },
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
                    this.cityModel.find()
                        .select({
                        "cityName": 1,
                        "stateName": 1,
                        "countryName": 1,
                        "_id": 0
                    })
                        .where(searchQuery)
                        .sort(sortQuery)
                        .skip(skip)
                        .limit(limit),
                    this.cityModel.countDocuments(searchQuery),
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
