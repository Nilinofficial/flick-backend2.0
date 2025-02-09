import express ,{ Router } from 'express';
import { getProfile } from '../controllers/profileController';
import { userAuth } from '../middleware/auth';

const profileRouter: Router = express.Router();

profileRouter.get('/',userAuth, getProfile);

export default profileRouter;
