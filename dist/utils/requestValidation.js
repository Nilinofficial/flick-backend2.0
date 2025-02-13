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
exports.connectionResponseValidation = exports.connectionRequestValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const connectionRequestModel_1 = __importDefault(require("../models/connectionRequestModel"));
const connectionRequestValidation = (fromUserId, toUserId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = ['interested', 'ignored'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid Status Type');
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(toUserId)) {
        throw new Error('Invalid User ID format');
    }
    const user = yield userModel_1.default.findById(toUserId);
    if (!user) {
        throw new Error('Oops! You are trying to connect with a user that doesnt exists');
    }
    const connectionExists = yield connectionRequestModel_1.default.findOne({
        $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
        ],
    });
    if (connectionExists) {
        throw new Error('Oops ! There is a pending connection Request');
    }
});
exports.connectionRequestValidation = connectionRequestValidation;
const connectionResponseValidation = (status, requestId, loggedInUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const validResponseStatus = ['accepted', 'rejected'];
    if (!validResponseStatus.includes(status)) {
        throw new Error('Invalid status type');
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(requestId)) {
        throw new Error('Invalid User ID format');
    }
});
exports.connectionResponseValidation = connectionResponseValidation;
