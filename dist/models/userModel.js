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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            const isEmail = validator_1.default.isEmail(value);
            if (!isEmail) {
                throw new Error('Enter a valid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
    profilePicUrl: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationOtp: {
        type: String,
        default: '',
    },
    verificationOtpExpiresAt: {
        type: Number,
        default: 0,
    },
    passwordResetOtp: {
        type: String,
        default: '',
    },
    passwordResetOtpExpiresAt: {
        type: Number,
        default: 0,
    },
});
userSchema.methods.generateJWT = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        return jsonwebtoken_1.default.sign({ _id: this._id }, secret, {
            expiresIn: '1d',
        });
    });
};
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
const User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.default = User;
