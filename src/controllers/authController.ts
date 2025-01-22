import { Request, Response } from 'express';
import { ReqBodyProps } from '../types';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { validateRegister } from '../utils/authValidation';

export const register = async (
  req: Request<{}, {}, ReqBodyProps>,
  res: Response
): Promise<any> => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await validateRegister(req);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = await user.generateJWT();

    // research more about this
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'user created successfully',
    });
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
