"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFriends = exports.getFriendRequests = void 0;
const connectionRequestModel_1 = __importDefault(require("../models/connectionRequestModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getFriendRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const requests = yield connectionRequestModel_1.default
            .find({
            toUserId: userId,
            status: 'interested',
        })
            .populate('fromUserId', ['firstName', 'lastName', 'profilePicUrl']);
        return res.status(200).json({
            message: 'List of all friend requests',
            data: requests,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message,
            });
        }
        else {
            return res.status(400).json({
                message: `An unexpected error occured`,
            });
        }
    }
});
exports.getFriendRequests = getFriendRequests;
const findFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const connectionRequest = yield connectionRequestModel_1.default
            .find({
            $or: [{ fromUserId: userId }, { toUserId: userId }],
        })
            .select(['fromUserId', 'toUserId']);
        const hideUsersFromList = new Set();
        connectionRequest.map((connectionRequest) => {
            hideUsersFromList.add(connectionRequest.fromUserId.toString());
            hideUsersFromList.add(connectionRequest.toUserId.toString());
        });
        const users = yield userModel_1.default.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromList) } },
                { _id: { $ne: userId } },
            ],
        });
        res.status(200).json({
            data: users,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message,
            });
        }
        else {
            return res.status(400).json({
                message: `An unexpected error occured`,
            });
        }
    }
});
exports.findFriends = findFriends;
