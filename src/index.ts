import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import authRouter from './routes/auth';
import { connectToDB } from './config/database';
import userRouter from './routes/user';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/profile', userRouter);

connectToDB().then(() =>
  app.listen(PORT, () => {
    console.log(`Server is listening to port  ${PORT} `);
  })
);
