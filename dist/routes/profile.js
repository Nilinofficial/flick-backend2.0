"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const auth_1 = require("../middleware/auth");
const profileRouter = express_1.default.Router();
profileRouter.get('/', auth_1.userAuth, profileController_1.getProfile);
exports.default = profileRouter;
