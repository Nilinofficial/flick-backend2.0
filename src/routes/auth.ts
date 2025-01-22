import express, { Router } from 'express';
import { register } from '../controllers/authController';

const authRouter: Router = express.Router();

authRouter.post('/register', register);

export default authRouter;
