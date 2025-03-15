import { Router } from 'express';
import { findFriends, getFriendRequests } from '../controllers/userController';
import { userAuth } from '../middleware/auth';

const userRouter = Router();

userRouter.get('/requests', userAuth, getFriendRequests);
userRouter.get('/findFriends', userAuth, findFriends);

export default userRouter;
