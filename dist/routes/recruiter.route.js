"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recruiter_controller_1 = __importDefault(require("@controllers/recruiter.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const recruiter_validator_1 = require("@validators/recruiter.validator");
const route = express_1.default.Router();
route.get('/datatable', recruiter_controller_1.default.datatable);
route.get('/count', recruiter_controller_1.default.count);
route.get('/', recruiter_controller_1.default.getRecruiters);
route.get('/:id', recruiter_controller_1.default.getRecruiter);
route.post('/', (0, validator_middleware_1.default)(recruiter_validator_1.createRecruiter), recruiter_controller_1.default.createRecruiter);
route.patch('/:id', (0, validator_middleware_1.default)(recruiter_validator_1.updateRecruiter), recruiter_controller_1.default.updateRecruiter);
route.delete('/:id', (0, validator_middleware_1.default)(recruiter_validator_1.deleteRecruiter), recruiter_controller_1.default.deleteRecruiter);
exports.default = route;
