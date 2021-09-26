"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const usersApi = require("./routes/usersRoutes");
const loginApi = require("./routes/loginRoutes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/users", usersApi);
app.use("/login", loginApi);
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Started in port ${PORT}.`);
});
