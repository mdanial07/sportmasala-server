const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const routes = require('./Routes/api');

const app = express()

mongoose.connect(config.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("Mongo not connect, Error = ", err);
    } else {
        console.log("Mongo Connected")
    }
})

var corsOptionsDelegate = function (req, callback) {
    var corsOptions
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true, credentials: true }
    } else {
        corsOptions = { origin: false, credentials: true }
    }
    callback(null, corsOptions)
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'storage')));

app.use(cors(corsOptionsDelegate))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', routes)

var whitelist = [
    'http://localhost:4401',
    'http://localhost:4410',
    'https://sports.jenzo.store',
]

app.use('/*', express.static(path.join(__dirname, 'public')));
app.use('/*', express.static(path.join(__dirname, 'storage')));

app.use((err, req, res, next) => {
    console.log(err.message)
    res.send(err.message)
    next()
})

module.exports = app