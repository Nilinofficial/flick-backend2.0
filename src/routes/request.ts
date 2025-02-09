import { Router } from 'express';
import { userAuth } from '../middleware/auth';
import { handleConnectionRequest, respondToRequest } from '../controllers/requestController';

const requestRouter = Router();

requestRouter.post('/send/:status/:toUserId', userAuth, handleConnectionRequest);
requestRouter.post('/respond/:status/:requestId',userAuth,respondToRequest)


export default requestRouter;
