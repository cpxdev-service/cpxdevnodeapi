const { Router } = require('express'); 
const app = Router(); 
const { createPool} = require('mysql2');
const connection = createPool('mysql://avnadmin:AVNS_ysCQDNAWaVQYdvKTwma@cpxdevdb-cpxdevservice.aivencloud.com:21013/nodejsdemo');
const basepath = '/mynote'

app.get(basepath + '/', (req, res) => {
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
app.post(basepath + '/', (req, res) => {
    const body = req.body;
    try {
      JSON.parse(body);
    } catch(e) {
      res.status(403).json({
        status: false,
        message: 'Request body should be in JSON format.'
    })
    }
    res.json({
        status: true
    })
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