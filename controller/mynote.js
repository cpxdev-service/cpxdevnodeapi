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
        response: error
      });
      return;
    }

    if (results == undefined) {
    res.json({
        status: true,
        response: []
      });
      return;
    }

    res.json({
        status: true,
        response: results
      });

  });
});
app.get(basepath + '/:noteId', (req, res) => {
    res.json({
        status: true
    })
})
app.post(basepath + '/', (req, res) => {
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