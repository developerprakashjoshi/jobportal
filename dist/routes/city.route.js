"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const city_controller_1 = __importDefault(require("@controllers/city.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const city_validator_1 = require("@validators/city.validator");
const route = express_1.default.Router();
route.get('/datatable', city_controller_1.default.datatable);
route.get('/name/:cityName', city_controller_1.default.getCityName);
route.get('/count', city_controller_1.default.count);
route.get('/', city_controller_1.default.getCities);
route.get('/:id', city_controller_1.default.getCity);
route.post('/', (0, validator_middleware_1.default)(city_validator_1.createCity), city_controller_1.default.createCity);
route.patch('/:id', (0, validator_middleware_1.default)(city_validator_1.updateCity), city_controller_1.default.updateCity);
route.delete('/:id', (0, validator_middleware_1.default)(city_validator_1.deleteCity), city_controller_1.default.deleteCity);
exports.default = route;
