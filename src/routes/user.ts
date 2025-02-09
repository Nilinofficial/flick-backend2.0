import { Router } from 'express';
import { getFriendRequests } from '../controllers/userController';
import { userAuth } from '../middleware/auth';

const userRouter = Router();

userRouter.get('/requests',userAuth, getFriendRequests);

export default userRouter;
