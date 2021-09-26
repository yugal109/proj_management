"use strict";
exports.__esModule = true;
var jwtt = require("jsonwebtoken");
require("dotenv").config();
var auth = function (req, res, next) {
    var token = req.header("x-auth-token");
    try {
        var decoded = jwtt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).send("Authentication is required.");
    }
};
module.exports = auth;
