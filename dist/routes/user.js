"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const userRouter = (0, express_1.Router)();
userRouter.get('/requests', auth_1.userAuth, userController_1.getFriendRequests);
exports.default = userRouter;
