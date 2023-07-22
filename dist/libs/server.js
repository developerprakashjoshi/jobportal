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
Object.defineProperty(exports, "__esModule", { value: true });
class Server {
    constructor() {
        console.log("Hello");
    }
    static remoteAddr(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let ip = req.headers['x-forwarded-for'] ||
                req.socket.remoteAddress;
            if (typeof ip === 'string') {
                ip = ip.split(',')[0];
                ip = ip.split(':').slice(-1);
                return ip[0];
            }
            return undefined;
        });
    }
}
exports.default = Server;
