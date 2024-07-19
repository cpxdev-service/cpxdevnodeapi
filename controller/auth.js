const { Router } = require("express");
const { v4 } = require("uuid");
const express = require("express");
const app = Router();
const jwt = require("jsonwebtoken");
const os = require("os");
var md5 = require('md5');

const exjson = express.json();

app.post("/token", (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let checksum = {
    time: Date(),
    host: os.hostname(),
    userId: v4(),
  };
  let data = {
    time: checksum.time,
    host: checksum.host,
    userId: checksum.userId,
    checksum: md5(JSON.stringify(checksum))
  };

  const token = jwt.sign(data, jwtSecretKey, {
    expiresIn: "30m"
  });

  res.json({
    status: true,
    access_token: token,
  });
});
app.get("/getunix", (req, res) => {
  res.json({
    status: true,
    unix: Math.floor(+new Date() / 1000),
  });
});

module.exports = app;
