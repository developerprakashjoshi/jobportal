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
const recruiter_service_1 = __importDefault(require("@services/recruiter.service"));
const controller_1 = __importDefault(require("@libs/controller"));
const server_1 = __importDefault(require("@libs/server"));
class RecruiterController extends controller_1.default {
    static count(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let recruiterService = new recruiter_service_1.default();
            const result = yield recruiterService.count();
            res.status(result.statusCode).json(result);
        });
    }
    static getRecruiters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let recruiterService = new recruiter_service_1.default();
            const record = yield recruiterService.list();
            res.status(record.statusCode).json(record);
        });
    }
    static getRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let recruiterService = new recruiter_service_1.default();
            const records = yield recruiterService.retrieve(id);
            res.status(records.statusCode).json(records);
        });
    }
    static createRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let recruiterService = new recruiter_service_1.default();
            const result = yield recruiterService.create(data);
            res.status(result.statusCode).json(result);
        });
    }
    static updateRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let recruiterService = new recruiter_service_1.default();
            const result = yield recruiterService.update(id, data);
            res.status(result.statusCode).json(result);
        });
    }
    static deleteRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let recruiterService = new recruiter_service_1.default();
            const result = yield recruiterService.delete(id, data);
            res.status(result.statusCode).json(result);
        });
    }
    static datatable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.query;
            let recruiterService = new recruiter_service_1.default();
            const records = yield recruiterService.datatable(data);
            res.status(records.statusCode).json(records);
        });
    }
}
exports.default = RecruiterController;
