"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostsSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    caption: {
        type: String,
    },
    postUrl: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
const Post = mongoose_1.default.models.Post || mongoose_1.default.model('Post', PostsSchema);
exports.default = Post;
