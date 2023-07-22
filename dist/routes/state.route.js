"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const state_controller_1 = __importDefault(require("@controllers/state.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const state_validator_1 = require("@validators/state.validator");
const route = express_1.default.Router();
route.get('/datatable', state_controller_1.default.datatable);
route.get('/count', state_controller_1.default.count);
route.get('/name/:stateName', state_controller_1.default.getStateName);
route.get('/', state_controller_1.default.getStates);
route.get('/:id', state_controller_1.default.getState);
route.post('/', (0, validator_middleware_1.default)(state_validator_1.createState), state_controller_1.default.createState);
route.patch('/:id', (0, validator_middleware_1.default)(state_validator_1.updateState), state_controller_1.default.updateState);
route.delete('/:id', (0, validator_middleware_1.default)(state_validator_1.deleteState), state_controller_1.default.deleteState);
exports.default = route;
