import express ,{ Router } from 'express';
import authRouter from './auth';
import { getProfile } from '../controllers/userController';
import { userAuth } from '../middleware/auth';

const userRouter: Router = express.Router();

userRouter.get('/',userAuth, getProfile);

export default userRouter;
