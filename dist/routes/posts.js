"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const postsController_1 = require("../controllers/postsController");
const multer_1 = __importDefault(require("multer"));
const multer_2 = require("../middleware/multer");
const upload = (0, multer_1.default)({ storage: multer_2.storage });
const postsRouter = (0, express_1.Router)();
postsRouter.post('/addPost', auth_1.userAuth, upload.single('image'), postsController_1.addPost);
postsRouter.get('/getAllPosts', auth_1.userAuth, postsController_1.getAllposts);
exports.default = postsRouter;
