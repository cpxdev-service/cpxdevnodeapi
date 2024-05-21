const { Router } = require("express");
const { v4 } = require("uuid");
const express = require("express");
const app = Router();
const { createPool } = require("mysql2");
const { valid } = require("../service/token");
const constr = process.env.mysqlcon;

const exjson = express.json();

app.get("/", (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }
  const connection = createPool(constr);
  connection.query("SELECT * from addNote", function (error, results, fields) {
    if (error) {
      res.status(502).json({
        status: false,
        message: error.message,
      });
      return;
    }

    if (results == undefined) {
      res.json({
        status: true,
        responses: [],
      });
      return;
    }

    res.json({
      status: true,
      responses: results,
    });
  });
});
app.get("/:noteId", (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }
  const connection = createPool(constr);
  connection.query(
    "SELECT * from addNote WHERE noteId=? LIMIT 1",
    [req.params.noteId],
    function (error, results, fields) {
      if (error) {
        res.status(502).json({
          status: false,
          message: error.message,
        });
        return;
      }

      if (results == undefined) {
        res.json({
          status: true,
          response: null,
        });
        return;
      }

      res.json({
        status: true,
        response: results.length > 0 ? results[0] : null,
      });
    }
  );
});
app.post("/", exjson, (req, res) => {
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
  try {
    const connection = createPool(constr);
    connection.query(
      "INSERT INTO `nodejsdemo`.`addNote`(`noteId`,`noteHeader`,`noteDesc`,`noteCreated`,`noteUpdated`)VALUES" +
        "(?,?,?,UTC_TIMESTAMP(),UTC_TIMESTAMP());",
      [nid, body.noteheader, body.notedesc],
      function (error, results, fields) {
        if (error) {
          res.status(502).json({
            status: false,
            message: error.message,
          });
          return;
        }

        if (results.affectedRows > 0) {
          res.status(201).json({
            status: true,
            noteId: nid,
          });
        } else {
          res.status(403).json({
            status: false,
            message: "Data not changed",
          });
        }
      }
    );
  } catch (ex) {
    res.status(502).json({
      status: false,
      message: ex.message,
    });
  }
});
app.put("/:noteId", exjson, (req, res) => {
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
  try {
    const connection = createPool(constr);
    connection.query(
      "UPDATE `nodejsdemo`.`addNote` SET `noteHeader` = ?," +
        "`noteDesc` = ?,`noteUpdated` = UTC_TIMESTAMP() WHERE `noteId` = ?;",
      [body.noteheader, body.notedesc, req.params.noteId],
      function (error, results, fields) {
        if (error) {
          res.status(502).json({
            status: false,
            message: error.message,
          });
          return;
        }

        if (results.affectedRows > 0) {
          res.status(202).json({
            status: true,
            noteId: req.params.noteId,
          });
        } else {
          res.status(403).json({
            status: false,
            message: "Data not changed",
          });
        }
      }
    );
  } catch (ex) {
    res.status(502).json({
      status: false,
      message: ex.message,
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
  try {
    const connection = createPool(constr);
    connection.query(
      "DELETE  from `nodejsdemo`.`addNote` WHERE `noteId` = ?;",
      [req.params.noteId],
      function (error, results, fields) {
        if (error) {
          res.status(502).json({
            status: false,
            message: error.message,
          });
          return;
        }

        if (results.affectedRows > 0) {
          res.status(204).json({
            status: true,
            noteId: req.params.noteId,
          });
        } else {
          res.status(403).json({
            status: false,
            message: "Data is already or not found",
          });
        }
      }
    );
  } catch (ex) {
    res.status(502).json({
      status: false,
      message: ex.message,
    });
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

  try {
    const connection = createPool(constr);
    connection.query(
      "DELETE  from `nodejsdemo`.`addNote` WHERE `noteId` IN (?);",
      body,
      function (error, results, fields) {
        if (error) {
          res.status(502).json({
            status: false,
            message: error.message,
          });
          return;
        }

        if (results.affectedRows == req.body.length) {
          res.json({
            status: true,
            allNoteId: req.body,
          });
          return;
        } else if (
          results.affectedRows > 0 &&
          results.affectedRows < req.body.length
        ) {
          res.json({
            status: false,
            message:
              "Delete successfully. But some record is cannot be deleted.",
          });
          return;
        }
        res.json({
          status: false,
          message: "Record already deleted.",
        });
      }
    );
  } catch (ex) {
    res.status(502).json({
      status: false,
      message: ex.message,
    });
  }
});

module.exports = app;
