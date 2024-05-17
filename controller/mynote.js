const { Router } = require('express'); 
const app = Router(); 
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'cpxdevdb-cpxdevservice.aivencloud.com',
    user     : 'avnadmin',
    password : 'AVNS_ysCQDNAWaVQYdvKTwma',
    database : 'nodejsdemo',
    port: 21023,
    ssl : true
  });

const basepath = '/mynote'

app.get(basepath + '/', (req, res) => {
    connection.connect();
    connection.query('SELECT * from addNote', function (error, results, fields) {
        if (error) {
            connection.end();
            res.json({
                status: false,
                response: error
            })
        };
        connection.end();
        res.json({
            status: true,
            response: results
        })
    });
})
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