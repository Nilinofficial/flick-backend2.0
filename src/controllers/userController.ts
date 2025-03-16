import { Request, Response } from 'express';
import connectionRequestModel from '../models/connectionRequestModel';
import User from '../models/userModel';

export const getFriendRequests = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  try {
    const requests = await connectionRequestModel
      .find({
        toUserId: userId,
        status: 'interested',
      })
      .populate('fromUserId', ['firstName', 'lastName', 'profilePicUrl']);

    return res.status(200).json({
      message: 'List of all friend requests',
      data: requests,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({
        message: err.message,
      });
    } else {
      return res.status(400).json({
        message: `An unexpected error occured`,
      });
    }
  }
};

export const findFriends = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  try {
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [{ fromUserId: userId }, { toUserId: userId }],
      })
      .select(['fromUserId', 'toUserId']);

    const hideUsersFromList = new Set();

    connectionRequest.map((connectionRequest) => {
      hideUsersFromList.add(connectionRequest.fromUserId.toString());
      hideUsersFromList.add(connectionRequest.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromList) } },
        { _id: { $ne: userId } },
      ],
    });

    res.status(200).json({
      data: users,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({
        message: err.message,
      });
    } else {
      return res.status(400).json({
        message: `An unexpected error occured`,
      });
    }
  }
};
