const { Router } = require('express'); 
const { v4 } = require('uuid');
const express = require('express')
const app = Router(); 
const { createPool} = require('mysql2');
const constr = ('mysql://avnadmin:AVNS_ysCQDNAWaVQYdvKTwma@cpxdevdb-cpxdevservice.aivencloud.com:21013/nodejsdemo');
const basepath = '/mynote'

app.get(basepath + '/', (req, res) => {
  const connection = createPool(constr);
  connection.query('SELECT * from addNote', function (error, results, fields) {
    if (error) {
      res.status(502).json({
        status: false,
        message: error.message
      });
      return;
    }

    if (results == undefined) {
      res.json({
        status: true,
        responses: []
      });
      return;
    }

    res.json({
        status: true,
        responses: results
      });

  });
});
app.get(basepath + '/:noteId', (req, res) => {
  const connection = createPool(constr);
  connection.query('SELECT * from addNote WHERE noteId=? LIMIT 1', [ req.params.noteId ], function (error, results, fields) {
    if (error) {
      res.status(502).json({
        status: false,
        message: error.message
      });
      return;
    }

    if (results == undefined) {
      res.json({
        status: true,
        response: null
      });
      return;
    }

    res.json({
        status: true,
        response: results.length > 0 ? results[0] : null
      });

  });
})
app.post(basepath + '/', express.json(), (req, res) => {
    let body = req.body;
   if (JSON.stringify(body) == '{}') {
      res.status(403).json({
        status: false,
        message: 'Data is empty.'
      });
      return;
   }
   const datacheck = JSON.stringify(body).toLowerCase();
   if (!(datacheck.includes('noteheader') && datacheck.includes('notedesc'))) {
      res.status(403).json({
        status: false,
        message: 'Data is wrong format.'
      });
      return;
   }
   body = JSON.parse(JSON.stringify(body).toLowerCase());
   const nid = v4();
   try {
    const connection = createPool(constr);
  connection.query('INSERT INTO `nodejsdemo`.`addNote`(`noteId`,`noteHeader`,`noteDesc`,`noteCreated`,`noteUpdated`)VALUES'+
'(?,?,?,UTC_TIMESTAMP(),UTC_TIMESTAMP());', [ nid, body.noteheader, body.notedesc ], function (error, results, fields) {
    if (error) {
      res.status(502).json({
        status: false,
        message: error.message
      });
      return;
    }

    res.json({
        status: true,
        noteId: nid
      });

  });
   } catch (ex) {
      res.status(502).json({
        status: false,
        message: ex.message
      });
   }
})
app.put(basepath + '/:noteId', (req, res) => {
    res.json({
        status: true
    })
})
app.delete(basepath + '/:noteId', (req, res) => {
    res.json({
        status: true
    })
})

module.exports = app;