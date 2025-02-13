"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const authRouter = express_1.default.Router();
authRouter.post('/register', authController_1.register);
authRouter.post('/login', authController_1.login);
authRouter.post('/logout', authController_1.logout);
authRouter.post("/sendOtp", auth_1.userAuth, authController_1.sendOtp);
authRouter.post("/verifyOtp", authController_1.verifyOtp);
authRouter.post('/sendResetPasswordOtp', authController_1.sendResetPasswordOtp);
authRouter.post('/updatePassword', authController_1.updatePassword);
exports.default = authRouter;
