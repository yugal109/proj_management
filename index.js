"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
require("dotenv").config();
var usersApi = require("../src/routes/usersRoutes");
var loginApi = require("../src/routes/loginRoutes");
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.use("/users", usersApi);
app.use("/login", loginApi);
var PORT = process.env.PORT || 6000;
app.listen(PORT, function () {
    console.log("Started in port " + PORT + ".");
});
