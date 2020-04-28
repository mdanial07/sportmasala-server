'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const api = require('./Routes/api');

const app = express()

mongoose.connect(config.MONGO_CONNECTION_LOCAL, { useNewUrlParser: true, useFindAndModify: false }, (err) => {
    if (err) {
        console.log("Mongo not connect, Error = ", err);
    } else {
        console.log("Mongo Connected")
    }
})

var whitelist = [
    'http://localhost:8037',
    'http://localhost:4000',
]

var corsOptionsDelegate = function (req, callback) {
    var corsOptions
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true, credentials: true }
    } else {
        corsOptions = { origin: false, credentials: true }
    }
    callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', api)
// app.use('/api/admin', admin)
// app.use('/public', express.static(path.join(__dirname, '/public')))

app.use((err, req, res, next) => {
    console.log(err.message)
    res.send(err.message)
    next()
})

module.exports = app