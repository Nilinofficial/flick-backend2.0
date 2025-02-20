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
exports.loginValidation = exports.validateRegister = void 0;
const validator_1 = __importDefault(require("validator"));
const userModel_1 = __importDefault(require("../models/userModel"));
const validateStringLength = (str, min, max, field) => {
    if (str.length < min || str.length > max) {
        throw new Error(`${field} must be between ${min} and ${max} characters`);
    }
};
const validateRegister = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    validateStringLength(firstName, 3, 30, 'First Name');
    validateStringLength(lastName, 1, 30, 'Last Name');
    const isEmail = validator_1.default.isEmail(email);
    if (!isEmail)
        throw new Error('Enter a valid email');
    const userExists = yield userModel_1.default.findOne({ email });
    if (userExists) {
        throw new Error('User with this email already exists!');
    }
    const isStrongPassword = validator_1.default.isStrongPassword(password);
    if (!isStrongPassword) {
        throw new Error('Enter a strong password');
    }
});
exports.validateRegister = validateRegister;
const loginValidation = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email });
    if (!user)
        throw new Error('Enter a registered email id.');
    return user;
});
exports.loginValidation = loginValidation;
