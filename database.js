"use strict";
const { Pool } = require("pg");
require("dotenv").config();
try {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    console.log("Successfully connected to database");
    module.exports = pool;
}
catch (error) {
    console.log(error);
}
