"use strict";
const { Pool } = require("pg");
require("dotenv").config();
const connectionString = process.env.DATABASE_URL;
try {
    const pool = new Pool({
        connectionString
    });
    console.log("Successfully connected to database");
    module.exports = pool;
}
catch (error) {
    console.log(error);
}
