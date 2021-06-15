'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matches = new Schema({
    team1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    team2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    week: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    team1score: {
        type: Number,
        default: null,
    },
    team2score: {
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