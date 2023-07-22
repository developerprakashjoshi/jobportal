"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apply_controller_1 = __importDefault(require("@controllers/apply.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const apply_validator_1 = require("@validators/apply.validator");
const route = express_1.default.Router();
route.get('/search', apply_controller_1.default.search);
route.get('/datatable', apply_controller_1.default.datatable);
route.get('/count', apply_controller_1.default.count);
route.get('/', apply_controller_1.default.getApplys);
route.get('/:id', apply_controller_1.default.getApply);
route.post('/', (0, validator_middleware_1.default)(apply_validator_1.createApply), apply_controller_1.default.createApply);
route.patch('/:id', (0, validator_middleware_1.default)(apply_validator_1.updateApply), apply_controller_1.default.updateApply);
route.delete('/:id', (0, validator_middleware_1.default)(apply_validator_1.deleteApply), apply_controller_1.default.deleteApply);
exports.default = route;
