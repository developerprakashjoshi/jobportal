"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interview_controller_1 = __importDefault(require("@controllers/interview.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const interview_validator_1 = require("@validators/interview.validator");
const route = express_1.default.Router();
route.get('/datatable', interview_controller_1.default.datatable);
route.get('/count', interview_controller_1.default.count);
route.get('/', interview_controller_1.default.getInterviews);
route.get('/:id', interview_controller_1.default.getInterview);
route.post('/', (0, validator_middleware_1.default)(interview_validator_1.createInterview), interview_controller_1.default.createInterview);
route.patch('/:id', (0, validator_middleware_1.default)(interview_validator_1.updateInterview), interview_controller_1.default.updateInterview);
route.delete('/:id', (0, validator_middleware_1.default)(interview_validator_1.deleteInterview), interview_controller_1.default.deleteInterview);
exports.default = route;
