import { Router } from 'express';
import { userAuth } from '../middleware/auth';
import { handleConnectionRequest } from '../controllers/requestController';

const requestRouter = Router();

requestRouter.post('/send/:status/:toUserId', userAuth, handleConnectionRequest);

export default requestRouter;
