"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = __importDefault(require("@controllers/review.controller"));
const validator_middleware_1 = __importDefault(require("@middlewares/validator.middleware"));
const review_validator_1 = require("@validators/review.validator");
const route = express_1.default.Router();
route.get('/datatable', review_controller_1.default.datatable);
route.get('/count', review_controller_1.default.count);
route.get('/', review_controller_1.default.getReviews);
route.get('/:id', review_controller_1.default.getReview);
route.post('/', (0, validator_middleware_1.default)(review_validator_1.createReview), review_controller_1.default.createReview);
route.patch('/:id', (0, validator_middleware_1.default)(review_validator_1.updateReview), review_controller_1.default.updateReview);
route.delete('/:id', (0, validator_middleware_1.default)(review_validator_1.deleteReview), review_controller_1.default.deleteReview);
exports.default = route;
