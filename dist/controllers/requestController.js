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
exports.respondToRequest = exports.handleConnectionRequest = void 0;
const connectionRequestModel_1 = __importDefault(require("../models/connectionRequestModel"));
const requestValidation_1 = require("../utils/requestValidation");
const handleConnectionRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const fromUserId = userId;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        yield (0, requestValidation_1.connectionRequestValidation)(fromUserId, toUserId, status);
        const connectRequest = new connectionRequestModel_1.default({
            fromUserId,
            toUserId,
            status,
        });
        const connectionRequestResponse = yield connectRequest.save();
        if (status === 'interested') {
            return res.status(200).json({
                message: `Connect request sent`,
                data: connectionRequestResponse,
            });
        }
        return res.status(200).json({
            message: `Ignored User`,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: err.message,
            });
        }
        else {
            return res.status(500).json({
                message: 'An unexpected Error occured',
            });
        }
    }
});
exports.handleConnectionRequest = handleConnectionRequest;
const respondToRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json('Unauthorized');
    }
    const status = req.params.status;
    const requestId = req.params.requestId;
    const loggedInUserId = userId;
    try {
        yield (0, requestValidation_1.connectionResponseValidation)(status, requestId, loggedInUserId);
        const connectionRequest = yield connectionRequestModel_1.default.findOne({
            toUserId: loggedInUserId,
            status: 'interested',
            _id: requestId,
        });
        if (!connectionRequest) {
            return res.status(404).json({ message: 'Connection Request not found' });
        }
        connectionRequest.status = status;
        const data = yield connectionRequest.save();
        return res.status(200).json({
            message: `connection req ${status}`,
            data: data,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({
                message: err.message,
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occured',
            });
        }
    }
});
exports.respondToRequest = respondToRequest;
