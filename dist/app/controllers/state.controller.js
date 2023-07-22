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
const state_service_1 = __importDefault(require("@services/state.service"));
const controller_1 = __importDefault(require("@libs/controller"));
const server_1 = __importDefault(require("@libs/server"));
class StateController extends controller_1.default {
    static count(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let stateService = new state_service_1.default();
            const result = yield stateService.count();
            res.status(result.statusCode).json(result);
        });
    }
    static getStateName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let stateService = new state_service_1.default();
            let name = req.params.stateName;
            const record = yield stateService.retrieveByState(name);
            res.status(record.statusCode).json(record);
        });
    }
    static getStates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let stateService = new state_service_1.default();
            const record = yield stateService.list();
            res.status(record.statusCode).json(record);
        });
    }
    static getState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let stateService = new state_service_1.default();
            const records = yield stateService.retrieve(id);
            res.status(records.statusCode).json(records);
        });
    }
    static createState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let stateService = new state_service_1.default();
            const result = yield stateService.create(data);
            res.status(result.statusCode).json(result);
        });
    }
    static updateState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let stateService = new state_service_1.default();
            const result = yield stateService.update(id, data);
            res.status(result.statusCode).json(result);
        });
    }
    static deleteState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let stateService = new state_service_1.default();
            const result = yield stateService.delete(id, data);
            res.status(result.statusCode).json(result);
        });
    }
    static datatable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.query;
            let stateService = new state_service_1.default();
            const records = yield stateService.datatable(data);
            res.status(records.statusCode).json(records);
        });
    }
}
exports.default = StateController;
