const { Router } = require("express");
const { v4 } = require("uuid");
const express = require("express");
const app = Router();
const { createPool } = require("mysql2");
const { valid } = require("../service/token");
const { MongoClient } = require("mongodb");

const exjson = express.json();

app.get("/", async (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }

  const client = new MongoClient(process.env.mongocon);
  try {
    client.connect();
    const database = client.db("nodejsdemo");
    const movies = database.collection("notedemo");
    const response = await movies.find({}, {projection:{ _id: 0 }}).toArray();
    client.close();
    res.json({
      status: true,
      responses: response,
    });
  } catch (e) {
    client.close();
    res.json({
      status: false,
      message: e.message,
    });
  }
});
app.get("/:noteId", async (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }

  const client = new MongoClient(process.env.mongocon);
  try {
    client.connect();
    const database = client.db("nodejsdemo");
    const movies = database.collection("notedemo");
    const response = await movies.findOne({noteId: req.params.noteId}, {projection:{ _id: 0 }});
    client.close();
    res.json({
      status: true,
      responses: response,
    });
  } catch (e) {
    client.close();
    res.json({
      status: false,
      message: e.message,
    });
  }
});
app.post("/", exjson, async (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }
  let body = req.body;
  if (JSON.stringify(body) == "{}") {
    res.status(403).json({
      status: false,
      message: "Data is empty.",
    });
    return;
  }
  const datacheck = JSON.stringify(body).toLowerCase();
  if (!(datacheck.includes("noteheader") && datacheck.includes("notedesc"))) {
    res.status(403).json({
      status: false,
      message: "Data is wrong format.",
    });
    return;
  }
  body = JSON.parse(JSON.stringify(body).toLowerCase());
  const nid = v4();

  const client = new MongoClient(process.env.mongocon);
  try {
    client.connect();
    const database = client.db("nodejsdemo");
    const movies = database.collection("notedemo");
    const response = await movies.insertOne({
      noteId: nid,
      noteHeader: body.noteheader, 
      noteDesc: body.notedesc,
      noteCreated: new Date(),
      noteUpdated: new Date()
    });
    client.close();
    response.
    res.json({
      status: true,
      noteId: nid,
    });
  } catch (e) {
    client.close();
    res.json({
      status: false,
      message: e.message,
    });
  }
});
app.put("/:noteId", exjson, async (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }
  let body = req.body;
  if (JSON.stringify(body) == "{}") {
    res.status(403).json({
      status: false,
      message: "Data is empty.",
    });
    return;
  }
  const datacheck = JSON.stringify(body).toLowerCase();
  if (!(datacheck.includes("noteheader") && datacheck.includes("notedesc"))) {
    res.status(403).json({
      status: false,
      message: "Data is wrong format.",
    });
    return;
  }
  body = JSON.parse(JSON.stringify(body).toLowerCase());

  const client = new MongoClient(process.env.mongocon);
  try {
    client.connect();
    const database = client.db("nodejsdemo");
    const movies = database.collection("notedemo");
    const response = await movies.updateOne({noteId: req.params.noteId}, {
      noteHeader: body.noteheader, 
      noteDesc: body.notedesc,
      noteUpdated: new Date()
    });
    client.close();
    response.
    res.json({
      status: true,
      noteId: nid,
    });
  } catch (e) {
    client.close();
    res.json({
      status: false,
      message: e.message,
    });
  }
});
app.delete("/:noteId", (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }
});
app.delete("/", exjson, (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }
  let body = req.body;
  if (JSON.stringify(body) == "[]") {
    res.status(403).json({
      status: false,
      message: "Data is empty.",
    });
    return;
  }
  if (body.length == 0) {
    res.status(403).json({
      status: false,
      message: "Data is empty.",
    });
    return;
  }
});

module.exports = app;
