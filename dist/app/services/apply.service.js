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
const service_1 = __importDefault(require("@libs/service"));
const response_1 = __importDefault(require("@libs/response"));
const apply_schema_1 = __importDefault(require("@models/apply.schema"));
// import User from '@models/user.schema';
// import Post from '@models/post.schema';
const meili_search_1 = __importDefault(require("@libs/meili.search"));
const mongodb_1 = require("mongodb");
const moment_1 = __importDefault(require("moment"));
class ApplyService extends service_1.default {
    constructor() {
        super();
        this.searchEngine = new meili_search_1.default();
        this.applyModel = apply_schema_1.default;
        // this.userModel = User;
        // this.postModel = Post;
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.applyModel.countDocuments();
                if (!result) {
                    return new response_1.default(true, 200, 'Record not available', result);
                }
                return new response_1.default(true, 200, 'Count operation successful', result);
            }
            catch (error) {
                return new response_1.default(false, 500, 'Internal Server Error', undefined, undefined, error.message);
            }
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.applyModel.find();
                if (!result) {
                    return new response_1.default(true, 200, 'Record not available', result);
                }
                return new response_1.default(true, 200, 'Read operation successful', result);
            }
            catch (error) {
                return new response_1.default(false, 500, 'Internal Server Error', undefined, undefined, error.message);
            }
        });
    }
    retrieve(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValidObjectId = mongodb_1.ObjectId.isValid(pid);
                if (!isValidObjectId) {
                    return new response_1.default(false, 400, 'Invalid ObjectId', undefined);
                }
                const record = yield this.applyModel.findById(pid);
                if (!record) {
                    return new response_1.default(true, 200, 'Record not available', record);
                }
                return new response_1.default(true, 200, 'Read operation successful', record);
            }
            catch (error) {
                return new response_1.default(false, 500, 'Internal Server Error', undefined, undefined, error.message);
            }
        });
    }
    retrieveByApply(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield this.applyModel.findOne({ name: name });
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
                const apply = new apply_schema_1.default();
                apply.job = data.jobId;
                apply.user = data.userId;
                apply.applyAt = new Date();
                apply.createdAt = new Date();
                apply.createdBy = data.created_by;
                apply.createdFrom = data.ip;
                const result = yield apply.save();
                return new response_1.default(true, 201, 'Insert operation successful', result);
            }
            catch (error) {
                return new response_1.default(false, 500, 'Internal Server Error', undefined, undefined, error.message);
            }
        });
    }
    update(pid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValidObjectId = mongodb_1.ObjectId.isValid(pid);
                if (!isValidObjectId) {
                    return new response_1.default(false, 400, 'Invalid ObjectId', undefined);
                }
                const apply = yield this.applyModel.findById(pid);
                if (!apply) {
                    return new response_1.default(true, 200, 'Record not available', apply);
                }
                if (data.jobId) {
                    apply.job = data.jobId;
                }
                if (data.userId) {
                    apply.user = data.userId;
                }
                apply.applyAt = new Date();
                // await this.searchEngine.updateIndex('apply', apply);
                const result = yield apply.save();
                return new response_1.default(true, 200, 'Update operation successful', result);
            }
            catch (error) {
                return new response_1.default(false, 500, 'Internal Server Error', undefined, undefined, error.message);
            }
        });
    }
    delete(pid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValidObjectId = mongodb_1.ObjectId.isValid(pid);
                if (!isValidObjectId) {
                    return new response_1.default(false, 400, 'Invalid ObjectId', undefined);
                }
                const apply = yield this.applyModel.findById(pid);
                if (!apply) {
                    return new response_1.default(true, 200, 'Record not available');
                }
                apply.deletedAt = (0, moment_1.default)().toDate(); // Set the deleted_at field to the current timestamp
                apply.deleteBy = data.deleteBy;
                apply.deleteFrom = data.ip;
                // await this.searchEngine.deleteDocument('apply', pid);
                const result = yield apply.save();
                return new response_1.default(true, 200, 'Delete operation successful', result);
            }
            catch (error) {
                return new response_1.default(false, 500, 'Internal Server Error', undefined, undefined, error.message);
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
                            { applyAt: { $regex: search, $options: 'i' } },
                            { jobId: { $regex: search, $options: 'i' } },
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
                    this.applyModel.find()
                        .select({
                        "jobId": 1,
                        "userId": 1,
                        "applyAt": 1,
                        "_id": 0
                    })
                        .where(searchQuery)
                        .sort(sortQuery)
                        .skip(skip)
                        .limit(limit),
                    this.applyModel.countDocuments(searchQuery),
                ]);
                console.log(records, totalCount);
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
    searchApplys(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchOptions = {
                    filters: `name:${query}*`,
                    attributesToRetrieve: ['name'], // Specify the column(s) to retrieve in the search results
                };
                const result = yield this.searchEngine.search('apply', query, searchOptions);
                return new response_1.default(true, 200, 'Search engine operation successful', result);
            }
            catch (error) {
                return new response_1.default(false, 500, 'Search engine server error', undefined, undefined, error.message);
            }
        });
    }
}
exports.default = ApplyService;
