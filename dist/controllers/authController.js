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
exports.updatePassword = exports.sendResetPasswordOtp = exports.verifyOtp = exports.sendOtp = exports.logout = exports.login = exports.register = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authValidation_1 = require("../utils/authValidation");
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const validator_1 = __importDefault(require("validator"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, profilePicUrl } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        yield (0, authValidation_1.validateRegister)(req);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new userModel_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePicUrl,
        });
        yield user.save();
        const token = yield user.generateJWT();
        // research more about this
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            // maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const mailOptions = {
            from: `"Founder Flick" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: 'Message from Flick!',
            html: `
        <h1>Welcome to Flick!</h1>
        <p>Hey <b>${firstName}</b>,</p>
        <p>Your account has been created with the email ID: <b>${email}</b>.</p>
      `,
        };
        nodemailer_1.default.sendMail(mailOptions);
        return res.status(200).json({
            message: 'user created successfully',
            token: token,
        });
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
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'All fields are required' });
    try {
        const user = yield (0, authValidation_1.loginValidation)(email);
        const isValidPassword = yield user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        const token = yield user.generateJWT();
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            // maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            message: `user successfully loggedIn`,
            token: token,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message,
            });
        }
        else {
            return res.status(500).json({
                message: 'An unexpected error occured.',
            });
        }
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
        });
        return res.status(200).json({ message: 'Successfully logged out' });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: err.message,
            });
        }
        else {
            return res.status(500).json({
                message: 'An unexpected error occured.',
            });
        }
    }
});
exports.logout = logout;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield userModel_1.default.findById(userId);
        if (user.isVerified) {
            return res.status(400).json({
                message: 'User already verified',
            });
        }
        const otp = String(Math.floor(1000 + Math.random() * 90000));
        user.verificationOtp = otp;
        user.verificationOtpExpiresAt = Date.now() + 5 * 60 * 1000;
        yield user.save();
        const mailOptions = {
            from: `"Founder Flick" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        };
        yield nodemailer_1.default.sendMail(mailOptions);
        return res.status(200).json({
            message: 'OTP send successfully',
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: err.message,
            });
        }
        else {
            return res.status(500).json({
                message: 'An unexpected error occured.',
            });
        }
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    const user = yield userModel_1.default.findById(userId);
    if (user.isVerified) {
        return res
            .status(400)
            .json({ message: 'Account has been already verified' });
    }
    try {
        if (user.verificationOtpExpiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP has been expired' });
        }
        if (user.verificationOtp === '' || user.verificationOtp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP',
            });
        }
        user.isVerified = true;
        user.verificationOtp = '';
        user.verificationOtpExpiresAt = 0;
        yield user.save();
        const mailOptions = {
            from: `"Founder Flick" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: 'Account Verified',
            text: `Your account has been successfully verified`,
        };
        yield nodemailer_1.default.sendMail(mailOptions);
        return res.status(200).json({
            message: 'Account successfully Verified',
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: err.message,
            });
        }
        else {
            return res.status(500).json({
                message: 'An unexpected error occured.',
            });
        }
    }
});
exports.verifyOtp = verifyOtp;
const sendResetPasswordOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return res.status(500).json({ message: 'Email is required' });
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'user not found' });
        const otp = String(Math.floor(Math.random() * 738464));
        user.passwordResetOtp = otp;
        user.passwordResetOtpExpiresAt = Date.now() + +5 * 60 * 1000;
        yield user.save();
        const mailOptions = {
            from: `"Founder Flarelabs" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        };
        yield nodemailer_1.default.sendMail(mailOptions);
        return res.status(200).json({
            message: 'OTP send successfully',
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: err.message,
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occured',
            });
        }
    }
});
exports.sendResetPasswordOtp = sendResetPasswordOtp;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, otp, email } = req.body;
    if (!email) {
        return res.status(500).json({ message: 'user not found' });
    }
    if (!newPassword) {
        return res.status(500).json({ message: 'Enter a valid password' });
    }
    if (!otp) {
        return res.status(500).json({ message: 'OTP is required' });
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'user not found' });
        if (user.passwordResetOtpExpiresAt < Date.now()) {
            return res.status(500).json({ message: 'OTP expired' });
        }
        if (user.passwordResetOtp === '' || user.passwordResetOtp !== otp) {
            return res.status(500).json({ message: 'Invalid OTP' });
        }
        const isStrongPassword = yield validator_1.default.isStrongPassword(newPassword);
        if (!isStrongPassword) {
            throw new Error('Enter a strong password');
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({
            message: 'Password updated successfully',
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: err.message,
            });
        }
        else {
            return res.status(500).json({
                message: 'An unexpected error occured',
            });
        }
    }
});
exports.updatePassword = updatePassword;
