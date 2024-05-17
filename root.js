
const express = require('express')
const app = express()
const path = require('path');
const {rateLimit} = require('express-rate-limit')

const Test = require('./controller/test'); 

const limiter = rateLimit({
	windowMs: 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: true,
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message: {
        status: false,
        message: 'Rate limit exceeded'
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'))
})
app.post('/status', (req, res) => {
    res.json({
      status: true,
      message: "Server is OK"
    })
  })

  app.use(Test);
  
  app.use(limiter)
app.listen(process.env.PORT || 5000, () => {
  console.log('Start server at port 5000.')
})
