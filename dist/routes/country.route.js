"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const country_controller_1 = __importDefault(require("@controllers/country.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const country_validator_1 = require("@validators/country.validator");
const route = express_1.default.Router();
route.get('/datatable', country_controller_1.default.datatable);
route.get('/count', country_controller_1.default.count);
route.get('/', country_controller_1.default.getCountries);
route.get('/:id', country_controller_1.default.getCountry);
route.post('/', (0, validator_middleware_1.default)(country_validator_1.createCountry), country_controller_1.default.createCountry);
route.patch('/:id', (0, validator_middleware_1.default)(country_validator_1.updateCountry), country_controller_1.default.updateCountry);
route.delete('/:id', (0, validator_middleware_1.default)(country_validator_1.deleteCountry), country_controller_1.default.deleteCountry);
exports.default = route;
