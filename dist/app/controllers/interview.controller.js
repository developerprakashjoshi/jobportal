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
const interview_service_1 = __importDefault(require("@services/interview.service"));
const controller_1 = __importDefault(require("@libs/controller"));
const server_1 = __importDefault(require("@libs/server"));
class InterviewController extends controller_1.default {
    static count(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let interviewService = new interview_service_1.default();
            const result = yield interviewService.count();
            res.json(result);
        });
    }
    static getInterviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let interviewService = new interview_service_1.default();
            const record = yield interviewService.list();
            res.json(record);
        });
    }
    static getInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let interviewService = new interview_service_1.default();
            const records = yield interviewService.retrieve(id);
            res.json(records);
        });
    }
    static createInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let interviewService = new interview_service_1.default();
            const result = yield interviewService.create(data);
            res.json(result);
        });
    }
    static updateInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let interviewService = new interview_service_1.default();
            const result = yield interviewService.update(id, data);
            res.json(result);
        });
    }
    static deleteInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let interviewService = new interview_service_1.default();
            const result = yield interviewService.delete(id, data);
            res.json(result);
        });
    }
    static datatable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.query;
            let interviewService = new interview_service_1.default();
            const records = yield interviewService.datatable(data);
            res.json(records);
        });
    }
}
exports.default = InterviewController;
