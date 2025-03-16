"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectionRequestSchema = new mongoose_1.default.Schema({
    fromUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    toUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('Cannot send connection request to yourself!');
    }
    next();
});
const connectionRequestModel = mongoose_1.default.models.connectionRequest ||
    mongoose_1.default.model('ConnectionRequest', connectionRequestSchema);
exports.default = connectionRequestModel;
