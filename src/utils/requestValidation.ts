import mongoose from 'mongoose';
import User from '../models/userModel';
import connectionRequestModel from '../models/connectionRequestModel';

export const connectionRequestValidation = async (
  fromUserId: string,
  toUserId: string,
  status: string
) => {
  const validStatuses = ['interested', 'ignored'];

  if (!validStatuses.includes(status)) {
    throw new Error('Invalid Status Type');
  }

  if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    throw new Error('Invalid User ID format');
  }

  const user = await User.findById(toUserId);

  const connectionExists = await connectionRequestModel.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (connectionExists) {
    throw new Error('Oops ! There is a pending connection Request');
  }

  if (!user) {
    throw new Error('Oops! You are trying to connect with an unknown User');
  }
};
