import { Router } from 'express';
import { userAuth } from '../middleware/auth';
import { addPost, getAllposts } from '../controllers/postsController';
import multer from 'multer';
import { storage } from '../middleware/multer';

const upload = multer({ storage });
const postsRouter = Router();

postsRouter.post('/addPost', userAuth, upload.single('image'), addPost);
postsRouter.get('/getAllPosts', userAuth, getAllposts);
export default postsRouter;
