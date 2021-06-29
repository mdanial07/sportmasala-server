'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cricketteams = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    shortname: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})
let CricketTeam = mongoose.model('cricketteams', cricketteams);
module.exports = { CricketTeam }