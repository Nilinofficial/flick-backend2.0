import { Request, Response } from 'express';
import connectionRequestModel from '../models/connectionRequestModel';

export const getFriendRequests = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  try {
    const requests = await connectionRequestModel.find({
      toUserId: userId,
      status:'interested'
    }).populate("fromUserId",["firstName","lastName",]);

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
