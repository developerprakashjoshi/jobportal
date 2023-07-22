"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = __importDefault(require("@controllers/notification.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const notification_validator_1 = require("@validators/notification.validator");
const route = express_1.default.Router();
route.get('/datatable', notification_controller_1.default.datatable);
route.get('/count', notification_controller_1.default.count);
route.get('/', notification_controller_1.default.getNotifications);
route.get('/:id', notification_controller_1.default.getNotification);
route.post('/', (0, validator_middleware_1.default)(notification_validator_1.createNotification), notification_controller_1.default.createNotification);
route.patch('/:id', (0, validator_middleware_1.default)(notification_validator_1.updateNotification), notification_controller_1.default.updateNotification);
route.delete('/:id', (0, validator_middleware_1.default)(notification_validator_1.deleteNotification), notification_controller_1.default.deleteNotification);
exports.default = route;
