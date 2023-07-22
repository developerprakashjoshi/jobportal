"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = __importDefault(require("@controllers/message.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const message_validator_1 = require("@validators/message.validator");
const route = express_1.default.Router();
route.get('/datatable', message_controller_1.default.datatable);
route.get('/count', message_controller_1.default.count);
route.get('/', message_controller_1.default.getMessages);
route.get('/:id', message_controller_1.default.getMessage);
route.post('/', (0, validator_middleware_1.default)(message_validator_1.createMessage), message_controller_1.default.createMessage);
route.patch('/:id', (0, validator_middleware_1.default)(message_validator_1.updateMessages), message_controller_1.default.updateMessages);
route.delete('/:id', (0, validator_middleware_1.default)(message_validator_1.deleteMessage), message_controller_1.default.deleteMessage);
exports.default = route;
