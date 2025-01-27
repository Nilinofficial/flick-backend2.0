import mongoose from 'mongoose';
import User from '../models/userModel';

export interface RegisterReqProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginReqProps {
  email: string;
  password: string;
}

export interface UserProps {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationOtp: string;
  verificationOtpExpiresAt: number;
  passwordResetOtp: string;
  passwordResetOtpExpiresAt: number;
  __v: number;
}

export interface DetailedUserProps extends UserProps {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  generateJWT: () => Promise<string>;
}

export interface VerifyOtpApiProps {
  otp: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: typeof User.prototype;
    }
  }
}


export interface updatePasswordProps{
  newPassword:string
}