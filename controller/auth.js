const { Router } = require("express");
const { v4 } = require("uuid");
const express = require("express");
const app = Router();
const jwt = require("jsonwebtoken");
const os = require("os");
var md5 = require('md5');
const { MongoClient } = require("mongodb");

const exjson = express.json();

app.post("/token", exjson, async (req, res) => {
  const client = new MongoClient(process.env.mongocon);
  const database = client.db("nodejsdemo");
  const movies = database.collection("authUser");
  const response = await movies.findOne(
    { user: req.body.userName.toLowerCase() }
  );
  client.close();
  if (response == null) {
    res.json({
      status: false,
      message: "User is already registered",
    });
    return;
  }

  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let checksum = {
    time: Date(),
    host: os.hostname(),
    userId: req.body.userName.toLowerCase(),
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
app.post("/register", exjson, async (req, res) => {
  const client = new MongoClient(process.env.mongocon);
  try {
    client.connect();
    const database = client.db("nodejsdemo");
    const movies = database.collection("authUser");
    const response = await movies.findOne(
      { userName: req.body.userName.toLowerCase() }
    );
    if (response != null) {
      client.close();
      res.json({
        status: false,
        message: "User is already registered",
      });
      return;
    }
    await movies.insertOne({
      userName: req.body.userName.toLowerCase(),
      userCreated: new Date()
    });
    client.close();
    res.json({
      status: true,
      userName: req.body.userName.toLowerCase()
    });
  } catch (e) {
    client.close();
    res.json({
      status: false,
      message: e.message,
    });
  }
});

app.get("/getunix", (req, res) => {
  res.json({
    status: true,
    unix: Math.floor(+new Date() / 1000),
  });
});
module.exports = app;
