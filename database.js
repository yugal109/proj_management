"use strict";
var Pool = require("pg").Pool;
require("dotenv").config();
try {
  var pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
      rejectUnauthorized: false,
    },
  });
  console.log("Successfully connected to database");
  module.exports = pool;
} catch (error) {
  console.log(error);
}
