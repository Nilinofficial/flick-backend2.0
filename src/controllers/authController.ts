import { Request, Response } from 'express';
import {
  LoginReqProps,
  RegisterReqProps,
  ResetPassSendOtpProps,
  updatePasswordProps,
  VerifyOtpApiProps,
} from '../types';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { loginValidation, validateRegister } from '../utils/authValidation';
import transporter from '../config/nodemailer';
import validator from 'validator';

export const register = async (
  req: Request<{}, {}, RegisterReqProps>,
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

    const mailOptions = {
      from: `"Founder Flarelabs" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: 'Message from Flarelabs!',
      html: `
        <h1>Welcome to Flarelabs!</h1>
        <p>Hey <b>${firstName}</b>,</p>
        <p>Your account has been created with the email ID: <b>${email}</b>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

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

export const login = async (
  req: Request<{}, {}, LoginReqProps>,
  res: Response
): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password)
    res.status(500).json({ message: 'All fields are required' });

  try {
    const user = await loginValidation(email);

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = await user.generateJWT();
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: `user successfully loggedIn`,
      token: token,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: err.message,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected error occured.',
      });
    }
  }
};

export const logout = async (
  req: Request<{}, {}, {}>,
  res: Response
): Promise<any> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({ message: 'Successfully logged out' });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: err.message,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected error occured.',
      });
    }
  }
};

export const sendOtp = async (
  req: Request<{}, {}, {}>,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (user.isVerified) {
      return res.status(400).json({
        message: 'User already verified',
      });
    }

    const otp = String(Math.floor(646672 * Math.random()));

    user.verificationOtp = otp;
    user.verificationOtpExpiresAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: `"Founder Flarelabs" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: 'Account verification OTP',
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'OTP send successfully',
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: err.message,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected error occured.',
      });
    }
  }
};

export const verifyOtp = async (
  req: Request<{}, {}, VerifyOtpApiProps>,
  res: Response
): Promise<any> => {
  const userId = req.userId;
  const { otp } = req.body;

  if (!otp) {
    res.status(404).json({ message: 'Invalid request' });
  }

  const user = await User.findById(userId);

  if (user.isVerified) {
    return res
      .status(400)
      .json({ message: 'Account has been already verified' });
  }

  try {
    if (user.verificationOtpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has been expired' });
    }

    if (user.verificationOtp === '' || user.verificationOtp !== otp) {
      return res.status(400).json({
        message: 'Invalid OTP',
      });
    }

    user.isVerified = true;
    user.verificationOtp = '';
    user.verificationOtpExpiresAt = 0;

    await user.save();

    const mailOptions = {
      from: `"Founder Flarelabs" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: 'Account Verified',
      text: `Your account has been successfully verified`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'Account successfully Verified',
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: err.message,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected error occured.',
      });
    }
  }
};

export const sendResetPasswordOtp = async (
  req: Request<{}, {}, ResetPassSendOtpProps>,
  res: Response
): Promise<any> => {
  const { email } = req.body;

  if (!email) return res.status(500).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'user not found' });

    const otp = String(Math.floor(Math.random() * 738464));

    user.passwordResetOtp = otp;
    user.passwordResetOtpExpiresAt = Date.now() + +5 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: `"Founder Flarelabs" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: 'Account verification OTP',
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'OTP send successfully',
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      res.status(500).json({
        message: 'An unexpected error occured',
      });
    }
  }
};

export const updatePassword = async (
  req: Request<{}, {}, updatePasswordProps>,
  res: Response
): Promise<any> => {
  const { newPassword, otp, email } = req.body;

  if (!email) {
    return res.status(500).json({ message: 'user not found' });
  }
  if (!newPassword) {
    return res.status(500).json({ message: 'Enter a valid password' });
  }
  if (!otp) {
    return res.status(500).json({ message: 'OTP is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'user not found' });

    if (user.passwordResetOtpExpiresAt < Date.now()) {
      return res.status(500).json({ message: 'OTP expired' });
    }

    if (user.passwordResetOtp === '' || user.passwordResetOtp !== otp) {
      return res.status(500).json({ message: 'Invalid OTP' });
    }

    const isStrongPassword = await validator.isStrongPassword(newPassword);

    if (!isStrongPassword) {
      throw new Error('Enter a strong password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: err.message,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected error occured',
      });
    }
  }
};
