'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matches = new Schema({
    leagueId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    seriesId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    team1Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    team2Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    ground: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
})
let CricketMatch = mongoose.model('cricketmatches', matches);
module.exports = { CricketMatch }