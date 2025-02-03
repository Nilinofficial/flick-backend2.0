import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['interested', 'ignored', 'accepted', 'rejected'],
        message: `{VALUE} is not a valid status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const connectionRequestModel =
  mongoose.models.connectionRequestModal ||
  mongoose.model('ConnectionRequest', connectionRequestSchema);

export default connectionRequestModel;
