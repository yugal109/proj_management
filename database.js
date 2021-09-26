"use strict";
var Pool = require("pg").Pool;
require("dotenv").config();
try {
    var pool = new Pool({
        user: process.env.USERNAME,
        host: "localhost",
        database: process.env.DATABASENAME,
        password: process.env.PASSWORD,
        port: 5432
    });
    console.log("Successfully connected to database");
    module.exports = pool;
}
catch (error) {
    console.log(error);
}
