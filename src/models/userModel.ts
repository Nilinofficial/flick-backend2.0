import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcyrpt from 'bcrypt';

const userSchema: Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      const isEmail = validator.isEmail(value);
      if (!isEmail) {
        throw new Error('Enter a valid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  profilePicUrl: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationOtp: {
    type: String,
    default: '',
  },
  verificationOtpExpiresAt: {
    type: Number,
    default: 0,
  },
  passwordResetOtp: {
    type: String,
    default: '',
  },
  passwordResetOtpExpiresAt: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.generateJWT = async function () {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return jwt.sign({ _id: this._id }, secret, {
    // expiresIn: '1d',
  });
};

userSchema.methods.comparePassword = async function (password: string) {
  return await bcyrpt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
