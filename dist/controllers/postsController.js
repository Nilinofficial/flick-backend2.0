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
exports.getAllposts = exports.addPost = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const promises_1 = __importDefault(require("fs/promises"));
const postModel_1 = __importDefault(require("../models/postModel"));
const connectionRequestModel_1 = __importDefault(require("../models/connectionRequestModel"));
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption } = req.body;
        const file = req.file;
        const userId = req.userId;
        if (!file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }
        const uploadResult = yield cloudinary_1.default.uploader.upload(file.path, {
            folder: 'posts',
        });
        yield promises_1.default.unlink(file.path);
        const newPost = yield postModel_1.default.create({
            userId,
            caption,
            postUrl: uploadResult.secure_url,
        });
        return res.status(201).json({
            message: 'Post created successfully',
            post: newPost,
        });
    }
    catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({
            message: 'Failed to create post',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.addPost = addPost;
const getAllposts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUserId = req.userId;
        const friends = yield connectionRequestModel_1.default
            .find({
            status: 'accepted',
            $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
        })
            .select('fromUserId toUserId -_id')
            .lean();
        const friendsId = friends
            .map((friend) => [friend.fromUserId, friend.toUserId])
            .flat()
            .filter((id) => id.toString() !== (loggedInUserId === null || loggedInUserId === void 0 ? void 0 : loggedInUserId.toString()));
        const posts = yield postModel_1.default.find({ userId: { $in: friendsId } }).populate('userId', ['firstName']);
        return res.status(200).json({
            message: 'successfully fetched posts',
            json: posts,
        });
    }
    catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({
            message: 'Failed to create post',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.getAllposts = getAllposts;
