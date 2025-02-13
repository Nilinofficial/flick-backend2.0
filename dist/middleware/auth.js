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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('')[1]);
        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in the environment variables.');
        }
        const { _id } = jsonwebtoken_1.default.verify(token, secret);
        if (!_id) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
        req.userId = _id;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: err.message,
            });
        }
        else {
            return res.status(500).json({
                message: 'An unexpected error occurred.',
            });
        }
    }
});
exports.userAuth = userAuth;
