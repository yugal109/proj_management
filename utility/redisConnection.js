"use strict";
const redis = require("redis");
require("dotenv").config();
try {
  const client = redis.createClient(
        process.env.REDIS_TLS_URL
      ? process.env.REDIS_TLS_URL
      : process.env.REDIS_URL,
    {
      tls: {
        rejectUnauthorized: false,
      },
    }
  );
  module.exports = client;
} catch (_a) {
  console.log("Couldnot connect to redis.");
}
