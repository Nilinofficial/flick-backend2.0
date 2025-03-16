import { Request, Response } from 'express';
import connectionRequestModel from '../models/connectionRequestModel';
import {
  connectionRequestValidation,
  connectionResponseValidation,
} from '../utils/requestValidation';
import { getIO } from '../utils/socket';

export const handleConnectionRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const fromUserId = userId;
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
      const io = getIO();
      // ✅ Notify received a friend request
      io.to(toUserId).emit('friendRequestReceived', {
        fromUserId,
        savedRequest: connectionRequestResponse,
      });

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

export const respondToRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json('Unauthorized');
  }

  const status = req.params.status;
  const requestId = req.params.requestId;
  const loggedInUserId = userId;

  try {
    await connectionResponseValidation(status, requestId);

    const connectionRequest = await connectionRequestModel.findOne({
      toUserId: loggedInUserId,
      status: 'interested',
      _id: requestId,
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: 'Connection Request not found' });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    return res.status(200).json({
      message: `connection req ${status}`,
      data: data,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({
        message: err.message,
      });
    } else {
      res.status(500).json({
        message: 'An unexpected error occured',
      });
    }
  }
};
