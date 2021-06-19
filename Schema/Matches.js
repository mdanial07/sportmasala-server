'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matches = new Schema({
    team1Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    team2Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    weekId: {
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
    team1result: {
        type: Number,
        default: null,
    },
    team2result: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
})
let Match = mongoose.model('matches', matches);
module.exports = { Match }