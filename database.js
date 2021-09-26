"use strict";
var Pool = require("pg").Pool;
require("dotenv").config();
const connectionString=process.env.DATABASE_URL
try {
    var pool = new Pool({
        connectionString
    
    });
    console.log("Successfully connected to database");
    module.exports = pool;
}
catch (error) {
    console.log(error);
}
