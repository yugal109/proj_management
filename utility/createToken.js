"use strict";
var jwt = require("jsonwebtoken");
require("dotenv").config;
var createToken = function (id) {
    var token = jwt.sign({ id: id }, process.env.SECRET_KEY);
    return token;
};
module.exports = createToken;
