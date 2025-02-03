import { Request } from 'express';
import validator from 'validator';
import User from '../models/userModel';
import { DetailedUserProps } from '../types';

const validateStringLength = (
  str: string,
  min: number,
  max: number,
  field: string
) => {
  if (str.length < min || str.length > max) {
    throw new Error(`${field} must be between ${min} and ${max} characters`);
  }
};

export const validateRegister = async (req: Request): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  validateStringLength(firstName, 3, 30, 'First Name');
  validateStringLength(lastName, 1, 30, 'Last Name');

  const isEmail = validator.isEmail(email);
  if (!isEmail) throw new Error('Enter a valid email');

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User with this email already exists!');
  }

  const isStrongPassword = validator.isStrongPassword(password);

  if (!isStrongPassword) {
    throw new Error('Enter a strong password');
  }
};

export const loginValidation = async (
  email: string
): Promise<DetailedUserProps> => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Enter a registered email id.');

  return user;
};


