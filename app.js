require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./router')
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const cors = require('cors')
const updater = require('./updater')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 9005

app.use('/api', router)

// run updater
updater()


http.listen(port)
console.log('Listening on port ' + port + " Version 19/10/21")
