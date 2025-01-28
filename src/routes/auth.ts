import express, { Router } from 'express';
import { login, logout, register, sendOtp, sendResetPasswordOtp, updatePassword, verifyOtp } from '../controllers/authController';
import { userAuth } from '../middleware/auth';

const authRouter: Router = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post("/sendOtp", userAuth, sendOtp);
authRouter.post("/verifyOtp",verifyOtp);
authRouter.post('/sendResetPasswordOtp',sendResetPasswordOtp);
authRouter.post('/updatePassword',updatePassword);

export default authRouter;
