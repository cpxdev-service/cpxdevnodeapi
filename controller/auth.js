const { Router } = require("express");
const { v4 } = require("uuid");
const express = require("express");
const app = Router();
const jwt = require("jsonwebtoken");

const exjson = express.json();

app.post("/token", (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: v4(),
  };

  const token = jwt.sign(data, jwtSecretKey, {
    expiresIn: "30m",
  });

  res.json({
    status: true,
    access_token: token,
  });
});
// app.get("/:noteId", (req, res) => {

// });

module.exports = app;