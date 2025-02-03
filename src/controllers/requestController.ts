import { Request, Response } from 'express';
import connectionRequestModel from '../models/connectionRequestModel';
import { connectionRequestValidation } from '../utils/requestValidation';

export const handleConnectionRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user = req.user;

  try {
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    await connectionRequestValidation(fromUserId, toUserId, status);

    const connectRequest = new connectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const connectionRequestResponse = await connectRequest.save();
    if (status === 'interested') {
      return res.status(200).json({
        message: `Connect request sent`,
        data: connectionRequestResponse,
      });
    }

    return res.status(200).json({
      message: `Ignored User`,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: err.message,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected Error occured',
      });
    }
  }
};
