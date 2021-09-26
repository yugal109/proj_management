"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtt = require("jsonwebtoken");
require("dotenv").config();
const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    try {
        const decoded = jwtt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).send("Authentication is required.");
    }
};
module.exports = auth;
