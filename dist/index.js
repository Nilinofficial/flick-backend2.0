"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const auth_1 = __importDefault(require("./routes/auth"));
const database_1 = require("./config/database");
const request_1 = __importDefault(require("./routes/request"));
const profile_1 = __importDefault(require("./routes/profile"));
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
const posts_1 = __importDefault(require("./routes/posts"));
const socket_1 = require("./utils/socket");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow cookies and authentication headers
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/profile', profile_1.default);
app.use('/request', request_1.default);
app.use('/user', user_1.default);
app.use('/posts', posts_1.default);
const server = http_1.default.createServer(app);
(0, socket_1.initializeSocket)(server);
(0, database_1.connectToDB)().then(() => server.listen(PORT, () => {
    console.log(`Server is listening to port  ${PORT} `);
}));
