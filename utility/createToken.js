"use strict";
const jwt = require("jsonwebtoken");
require("dotenv").config;
const createToken = (id) => {
    const token = jwt.sign({ id: id }, process.env.SECRET_KEY);
    return token;
};
module.exports = createToken;
