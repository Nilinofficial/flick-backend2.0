import express, { Router } from 'express';
import { login, logout, register, sendOtp, sendResetPasswordOtp, verifyOtp } from '../controllers/authController';
import { userAuth } from '../middleware/auth';

const authRouter: Router = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post("/sendOtp", userAuth, sendOtp);
authRouter.post("/verifyOtp",userAuth,verifyOtp);
authRouter.post('/sendResetPasswordOtp',userAuth,sendResetPasswordOtp);

export default authRouter;
