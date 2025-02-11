import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

export const userAuth = async (
  req: Request<{},{},{}>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split('')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not defined in the environment variables.'
      );
    }

    const { _id } = jwt.verify(token, secret) as JwtPayload;

    if (!_id) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

 
    
    req.userId = _id;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: err.message,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected error occurred.',
      });
    }
  }
};
