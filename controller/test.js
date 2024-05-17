const { Router } = require('express'); 
const app = Router(); 

const basepath = '/test'

app.get(basepath + '/test', (req, res) => {
    res.json({
        status: true
    })
})

module.exports = app;