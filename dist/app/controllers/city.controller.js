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
const city_service_1 = __importDefault(require("@services/city.service"));
const controller_1 = __importDefault(require("@libs/controller"));
const server_1 = __importDefault(require("@libs/server"));
class CityController extends controller_1.default {
    static count(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let cityService = new city_service_1.default();
            const result = yield cityService.count();
            res.status(result.statusCode).json(result);
        });
    }
    static getCityName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let cityService = new city_service_1.default();
            let name = req.params.cityName;
            const result = yield cityService.retrieveByCountry(name);
            res.status(result.statusCode).json(result);
        });
    }
    static getCities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let cityService = new city_service_1.default();
            const record = yield cityService.list();
            res.status(record.statusCode).json(record);
        });
    }
    static getCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let cityService = new city_service_1.default();
            const records = yield cityService.retrieve(id);
            res.status(records.statusCode).json(records);
        });
    }
    static createCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let cityService = new city_service_1.default();
            const result = yield cityService.create(data);
            res.status(result.statusCode).json(result);
        });
    }
    static updateCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let cityService = new city_service_1.default();
            const result = yield cityService.update(id, data);
            res.status(result.statusCode).json(result);
        });
    }
    static deleteCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            const data = req.body;
            data.ip = yield server_1.default.remoteAddr(req);
            let cityService = new city_service_1.default();
            const result = yield cityService.delete(id, data);
            res.status(result.statusCode).json(result);
        });
    }
    static datatable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.query;
            let cityService = new city_service_1.default();
            const records = yield cityService.datatable(data);
            res.status(records.statusCode).json(records);
        });
    }
}
exports.default = CityController;
