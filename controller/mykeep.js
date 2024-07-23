const { Router } = require("express");
const { v4 } = require("uuid");
const express = require("express");
const app = Router();
const { createPool } = require("mysql2");
const { valid } = require("../service/token");
const { MongoClient } = require("mongodb");

const exjson = express.urlencoded({
  extended: true
});

function checksize(req) {
  const size = Buffer.byteLength(JSON.stringify(req))
  if (size > 1048576) {
    return false;
  }
  return true;
}

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
    const response = await movies
      .find({}, { projection: { _id: 0 } })
      .toArray();
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
    const response = await movies.findOne(
      { noteId: req.params.noteId },
      { projection: { _id: 0 } }
    );
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
  if (checksize(body) == false) {
    res.status(403).json({
      status: false,
      message: "Data is too large.",
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
    await movies.insertOne({
      noteId: nid,
      noteHeader: body.noteheader,
      noteDesc: body.notedesc,
      noteCreated: new Date(),
      noteUpdated: new Date(),
    });
    client.close();
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
  if (checksize(body) == false) {
    res.status(403).json({
      status: false,
      message: "Data is too large.",
    });
    return;
  }
  body = JSON.parse(JSON.stringify(body).toLowerCase());

  const client = new MongoClient(process.env.mongocon);
  try {
    client.connect();
    const database = client.db("nodejsdemo");
    const movies = database.collection("notedemo");
    const response = await movies.updateOne(
      { noteId: req.params.noteId },
      {
        $set: {
          noteHeader: body.noteheader,
          noteDesc: body.notedesc,
          noteUpdated: new Date(),
        },
      }
    );
    client.close();
    if (response.modifiedCount > 0) {
      res.json({
        status: true,
        noteId: req.params.noteId,
      });
      return;
    }
    res.json({
      status: false,
      noteId: "Not changed",
    });
  } catch (e) {
    client.close();
    res.json({
      status: false,
      message: e.message,
    });
  }
});
app.delete("/:noteId", async (req, res) => {
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
    const response = await movies.deleteOne({ noteId: req.params.noteId });
    client.close();
    if (response.deletedCount > 0) {
      res.json({
        status: true,
        noteId: req.params.noteId,
      });
      return;
    }
    res.json({
      status: false,
      message: "Record is already deleted",
    });
  } catch (e) {
    client.close();
    res.json({
      status: false,
      message: e.message,
    });
  }
});
app.delete("/", exjson, async (req, res) => {
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

  const client = new MongoClient(process.env.mongocon);
  try {
    client.connect();
    const database = client.db("nodejsdemo");
    const movies = database.collection("notedemo");
    const filter = { noteId: { $in: body } };
    const response = await movies.deleteMany(filter);
    client.close();
    if (response.deletedCount == req.body.length) {
      res.json({
        status: true,
        allNoteId: req.body,
      });
      return;
    } else if (
      response.deletedCount > 0 &&
      response.deletedCount < req.body.length
    ) {
      res.json({
        status: false,
        message: "Delete successfully. But some record is cannot be deleted.",
      });
      return;
    }
    res.json({
      status: false,
      message: "Record already deleted.",
    });
  } catch (e) {
    client.close();
    res.json({
      status: false,
      message: e.message,
    });
  }
});

module.exports = app;
