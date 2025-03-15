import mongoose from 'mongoose';
import User from '../models/userModel';
import connectionRequestModel from '../models/connectionRequestModel';

export const connectionRequestValidation = async (
  fromUserId: mongoose.Schema.Types.ObjectId,
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
  if (!user) {
    throw new Error(
      'Oops! You are trying to connect with a user that doesnt exists'
    );
  }

  const connectionExists = await connectionRequestModel.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (connectionExists) {
    throw new Error('Oops ! There is a pending connection Request');
  }
};

export const connectionResponseValidation = async (
  status: string,
  requestId: string,
) => {
  const validResponseStatus = ['accepted', 'rejected'];

  if (!validResponseStatus.includes(status)) {
    throw new Error('Invalid status type');
  }

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error('Invalid User ID format');
  }
};
