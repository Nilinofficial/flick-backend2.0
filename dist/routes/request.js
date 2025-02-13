"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const requestController_1 = require("../controllers/requestController");
const requestRouter = (0, express_1.Router)();
requestRouter.post('/send/:status/:toUserId', auth_1.userAuth, requestController_1.handleConnectionRequest);
requestRouter.post('/respond/:status/:requestId', auth_1.userAuth, requestController_1.respondToRequest);
exports.default = requestRouter;
